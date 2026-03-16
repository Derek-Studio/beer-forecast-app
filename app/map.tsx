import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import DayFilter from "../components/DayFilter";
import { useNearbyPubs } from "../hooks/usePubs";
import { pubHasDealOnDay } from "../utils/dealDays";

const NativeMapView = Platform.OS !== "web" ? require("react-native-maps").default : null;
const NativeMarker = Platform.OS !== "web" ? require("react-native-maps").Marker : null;

function PubMarker({ emoji, dealCount }: { emoji: string; dealCount: number }) {
  return (
    <View style={marker.container}>
      <Text style={marker.emoji}>{emoji}</Text>
      {dealCount > 0 && (
        <View style={marker.badge}>
          <Text style={marker.badgeText}>{dealCount}</Text>
        </View>
      )}
    </View>
  );
}

const marker = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0D1B2A",
  },
});

function WebMap({ pubs, center, selectedDay }: {
  pubs: any[];
  center: [number, number];
  selectedDay: number | null;
}) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = "leaflet-css";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");

  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer center={center} zoom={14} style={{ flex: 1, height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {pubs.map((pub: any) => {
        if (selectedDay !== null && !pubHasDealOnDay(pub, selectedDay)) return null;
        return (
          <Marker key={pub.id} position={[pub.lat, pub.lng]} icon={icon}>
            <Popup>
              <strong>{pub.name}</strong><br />
              {pub.address}<br />
              <a href="#" onClick={(e: any) => { e.preventDefault(); router.push(`/pub/${pub.id}`); }}>
                View deals →
              </a>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  const { data: pubs } = useNearbyPubs(coords?.lat ?? null, coords?.lng ?? null);
  const center: [number, number] = coords ? [coords.lat, coords.lng] : [51.5074, -0.1278];

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <DayFilter selected={selectedDay} onChange={setSelectedDay} />
        <WebMap pubs={pubs ?? []} center={center} selectedDay={selectedDay} />
      </View>
    );
  }

  const region = {
    latitude: center[0],
    longitude: center[1],
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <View style={styles.container}>
        <DayFilter selected={selectedDay} onChange={setSelectedDay} />
        {NativeMapView && (
          <NativeMapView style={styles.map} region={region} showsUserLocation>
            {pubs?.map((pub: any) => {
              const hasDeals = selectedDay === null || pubHasDealOnDay(pub, selectedDay);
              const dealCount = pub.promotions?.length ?? 0;
              return NativeMarker ? (
                <NativeMarker
                  key={pub.id}
                  coordinate={{ latitude: pub.lat, longitude: pub.lng }}
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0.5 }}
                  opacity={hasDeals ? 1 : 0.25}
                  onPress={() => router.push(`/pub/${pub.id}`)}
                >
                  <PubMarker
                    emoji={pub.venue_emoji ?? "🍻"}
                    dealCount={hasDeals ? dealCount : 0}
                  />
                </NativeMarker>
              ) : null;
            })}
          </NativeMapView>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  map: { flex: 1 },
});

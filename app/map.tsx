import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useNearbyPubs } from "../hooks/usePubs";

// Native map (react-native-maps)
const NativeMapView = Platform.OS !== "web" ? require("react-native-maps").default : null;
const NativeMarker = Platform.OS !== "web" ? require("react-native-maps").Marker : null;

// Web map (react-leaflet) — loaded only on web to avoid SSR issues
function WebMap({ pubs, center }: { pubs: any[]; center: [number, number] }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Inject Leaflet CSS
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

  // Fix default marker icon (leaflet webpack issue)
  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ flex: 1, height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {pubs.map((pub: any) => (
        <Marker key={pub.id} position={[pub.lat, pub.lng]} icon={icon}>
          <Popup>
            <strong>{pub.name}</strong>
            <br />
            {pub.address}
            <br />
            <a
              href="#"
              onClick={(e: any) => {
                e.preventDefault();
                router.push(`/pub/${pub.id}`);
              }}
            >
              View deals →
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

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

  // Default to central London if no GPS
  const center: [number, number] = coords
    ? [coords.lat, coords.lng]
    : [51.5074, -0.1278];

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <WebMap pubs={pubs ?? []} center={center} />
      </View>
    );
  }

  // Native
  const region = {
    latitude: center[0],
    longitude: center[1],
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <View style={styles.container}>
        {NativeMapView && (
          <NativeMapView style={styles.map} region={region} showsUserLocation>
            {pubs?.map((pub: any) => (
              <NativeMarker
                key={pub.id}
                coordinate={{ latitude: pub.lat, longitude: pub.lng }}
                title={pub.name}
                description={pub.address}
                onCalloutPress={() => router.push(`/pub/${pub.id}`)}
              />
            ))}
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

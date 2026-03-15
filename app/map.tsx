import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useNearbyPubs } from "../hooks/usePubs";

const MapView = Platform.OS !== "web" ? require("react-native-maps").default : null;
const Marker = Platform.OS !== "web" ? require("react-native-maps").Marker : null;

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

  if (Platform.OS === "web") {
    return (
      <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
        <View style={styles.center}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.webText}>Map view not available on web</Text>
          <Text style={styles.webSubtext}>Check out the pubs below</Text>
          {pubs?.map((pub) => (
            <Text
              key={pub.id}
              style={styles.pubLink}
              onPress={() => router.push(`/pub/${pub.id}`)}
            >
              📍 {pub.name}
            </Text>
          ))}
        </View>
      </LinearGradient>
    );
  }

  const region = coords
    ? { latitude: coords.lat, longitude: coords.lng, latitudeDelta: 0.04, longitudeDelta: 0.04 }
    : { latitude: 51.5074, longitude: -0.1278, latitudeDelta: 0.1, longitudeDelta: 0.1 };

  return (
    <View style={styles.container}>
      {MapView && (
        <MapView style={styles.map} region={region} showsUserLocation>
          {pubs?.map((pub) => (
            <Marker
              key={pub.id}
              coordinate={{ latitude: pub.lat, longitude: pub.lng }}
              title={pub.name}
              description={pub.address}
              onCalloutPress={() => router.push(`/pub/${pub.id}`)}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 24,
  },
  mapEmoji: { fontSize: 48, marginBottom: 8 },
  webText: { fontSize: 16, color: "#fff", fontWeight: "500" },
  webSubtext: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 },
  pubLink: {
    fontSize: 15,
    color: "#F59E0B",
    paddingVertical: 6,
  },
});

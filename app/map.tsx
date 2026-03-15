import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useNearbyPubs } from "../hooks/usePubs";

// react-native-maps only renders on native platforms
const MapView = Platform.OS !== "web"
  ? require("react-native-maps").default
  : null;
const Marker = Platform.OS !== "web"
  ? require("react-native-maps").Marker
  : null;

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
      <View style={styles.center}>
        <Text style={styles.webText}>Map view not available on web</Text>
        <Text style={styles.webSubtext}>Use the Nearby tab to browse pubs</Text>
      </View>
    );
  }

  const region = coords
    ? {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    : {
        // Default to London if no location
        latitude: 51.5074,
        longitude: -0.1278,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f5f5f5",
  },
  webText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  webSubtext: {
    fontSize: 13,
    color: "#999",
  },
});

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PubCard from "../components/PubCard";
import { useNearbyPubs } from "../hooks/usePubs";

export default function NearbyScreen() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationReady, setLocationReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
      setLocationReady(true);
    })();
  }, []);

  const { data: pubs, isLoading, error } = useNearbyPubs(
    locationReady ? (coords?.lat ?? null) : null,
    locationReady ? (coords?.lng ?? null) : null
  );

  if (!locationReady || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>
          {!locationReady ? "Getting your location…" : "Loading pubs…"}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load pubs. Is the backend running?</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!coords && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Location unavailable — showing all pubs
          </Text>
        </View>
      )}
      <FlatList
        data={pubs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PubCard
            pub={item}
            onPress={() => router.push(`/pub/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pubs found nearby.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    paddingVertical: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
  },
  banner: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: {
    color: "#92400E",
    fontSize: 13,
    textAlign: "center",
  },
});

import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ForecastWidget from "../components/ForecastWidget";
import HourlyWidget from "../components/HourlyWidget";
import MapWidget from "../components/MapWidget";
import { useNearbyPubs } from "../hooks/usePubs";
import { SUMMARY } from "../mockData";

export default function DashboardScreen() {
  const router = useRouter();
  const [locationName, setLocationName] = useState("London");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        try {
          const [place] = await Location.reverseGeocodeAsync(loc.coords);
          if (place) {
            const parts = [place.district || place.subregion, place.city].filter(Boolean);
            if (parts.length > 0) setLocationName(parts.join(", "));
          }
        } catch {
          // ignore geocode errors
        }
      }
    })();
  }, []);

  const { data: pubs } = useNearbyPubs(coords?.lat ?? null, coords?.lng ?? null);
  const pubCount = pubs?.length ?? 0;
  const dealCount = pubs?.reduce((n, p) => n + (p.promotions?.length ?? 0), 0) ?? 0;

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E", "#0D1B2A"]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Location & summary header */}
        <View style={styles.header}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.location}>{locationName}</Text>
          <Text style={styles.condition}>{SUMMARY.condition}</Text>
          <Text style={styles.headline}>{SUMMARY.headline}</Text>
          <Text style={styles.dealRow}>
            {dealCount > 0 ? `${dealCount} deals` : "4 deals"}
            {"  ·  "}Peaks at {SUMMARY.peakTime}
          </Text>
          <Text style={styles.subline}>{SUMMARY.subline}</Text>
        </View>

        {/* Widgets */}
        <HourlyWidget onPress={() => router.push("/hourly")} />
        <MapWidget onPress={() => router.push("/map")} pubCount={pubCount || 4} />
        <ForecastWidget onPress={() => router.push("/forecast")} />

        <View style={styles.footer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingTop: 70 },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  locationPin: {
    fontSize: 14,
    marginBottom: 2,
  },
  location: {
    fontSize: 34,
    fontWeight: "300",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  condition: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  headline: {
    fontSize: 58,
    fontWeight: "200",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: -1,
  },
  dealRow: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 16,
  },
  subline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: { height: 40 },
});

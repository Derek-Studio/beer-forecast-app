import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FORECAST } from "../mockData";

function IntensityBar({ value }: { value: number }) {
  return (
    <View style={bar.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={[bar.block, i <= value ? bar.filled : bar.empty]} />
      ))}
    </View>
  );
}

const bar = StyleSheet.create({
  row: { flexDirection: "row", gap: 3 },
  block: { width: 16, height: 7, borderRadius: 2 },
  filled: { backgroundColor: "#F59E0B" },
  empty: { backgroundColor: "rgba(255,255,255,0.2)" },
});

export default function ForecastScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>14-Day Forecast</Text>
        <Text style={styles.subtitle}>Extended drink deal outlook. Accuracy not guaranteed.</Text>
        {FORECAST.map((day, i) => (
          <View key={i} style={[styles.row, i < FORECAST.length - 1 && styles.rowBorder]}>
            <Text style={styles.day}>{day.day}</Text>
            <Text style={styles.emoji}>{day.emoji}</Text>
            <View style={styles.info}>
              <View style={styles.metaRow}>
                <IntensityBar value={day.intensity} />
                <Text style={styles.count}>
                  {day.dealCount === 0 ? "none" : `${day.dealCount} deal${day.dealCount !== 1 ? "s" : ""}`}
                </Text>
              </View>
              <Text style={styles.blurb}>{day.blurb}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  day: { width: 44, fontSize: 14, color: "#fff", fontWeight: "500", paddingTop: 2 },
  emoji: { fontSize: 24, paddingTop: 0 },
  info: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  count: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
  blurb: { fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 17 },
  backBtn: { marginTop: 32, alignSelf: "center" },
  backText: { color: "rgba(255,255,255,0.5)", fontSize: 15 },
});

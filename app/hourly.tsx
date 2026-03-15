import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HOURLY } from "../mockData";

export default function HourlyScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hourly Forecast</Text>
        <Text style={styles.subtitle}>Today's drink deal outlook, hour by hour</Text>
        {HOURLY.map((slot, i) => (
          <View key={i} style={[styles.row, i < HOURLY.length - 1 && styles.rowBorder]}>
            <Text style={styles.time}>{slot.time}</Text>
            <Text style={styles.emoji}>{slot.emoji}</Text>
            <View style={styles.info}>
              <Text style={styles.label}>{slot.label}</Text>
            </View>
            <Text style={styles.deal}>{slot.deal}</Text>
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
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  time: { width: 46, fontSize: 14, color: "rgba(255,255,255,0.6)" },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  label: { fontSize: 16, color: "#fff", fontWeight: "500" },
  deal: { fontSize: 16, color: "#F59E0B", fontWeight: "600" },
  backBtn: { marginTop: 32, alignSelf: "center" },
  backText: { color: "rgba(255,255,255,0.5)", fontSize: 15 },
});

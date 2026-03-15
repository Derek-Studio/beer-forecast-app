import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FORECAST } from "../mockData";

type Props = { onPress: () => void };

function IntensityBar({ value }: { value: number }) {
  return (
    <View style={bar.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[bar.block, i <= value ? bar.filled : bar.empty]}
        />
      ))}
    </View>
  );
}

const bar = StyleSheet.create({
  row: { flexDirection: "row", gap: 2 },
  block: { width: 14, height: 6, borderRadius: 2 },
  filled: { backgroundColor: "#F59E0B" },
  empty: { backgroundColor: "rgba(255,255,255,0.2)" },
});

export default function ForecastWidget({ onPress }: Props) {
  const preview = FORECAST.slice(0, 5);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.label}>14-DAY FORECAST</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.divider} />
      {preview.map((day, i) => (
        <View key={i} style={[styles.row, i < preview.length - 1 && styles.rowBorder]}>
          <Text style={styles.day}>{day.day}</Text>
          <Text style={styles.emoji}>{day.emoji}</Text>
          <IntensityBar value={day.intensity} />
          <Text style={styles.count}>
            {day.dealCount === 0 ? "none" : `${day.dealCount} deal${day.dealCount !== 1 ? "s" : ""}`}
          </Text>
        </View>
      ))}
      <Text style={styles.seeAll}>See all 14 days</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.8,
  },
  chevron: {
    fontSize: 18,
    color: "rgba(255,255,255,0.5)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  day: {
    width: 46,
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  emoji: {
    fontSize: 20,
    width: 28,
  },
  count: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  seeAll: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    paddingVertical: 10,
  },
});

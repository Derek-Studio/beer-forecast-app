import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { onPress: () => void; pubCount: number };

export default function MapWidget({ onPress, pubCount }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.label}>NEARBY PUBS</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>📍</Text>
        <View style={styles.dotGrid}>
          {["🍺", "🍻", "🍷", "🥃"].slice(0, Math.min(pubCount, 4)).map((e, i) => (
            <Text key={i} style={styles.dot}>{e}</Text>
          ))}
        </View>
      </View>
      <Text style={styles.subtext}>
        {pubCount > 0 ? `${pubCount} pubs within 2km` : "Loading pubs…"}
      </Text>
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
    paddingBottom: 16,
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
    marginBottom: 14,
  },
  mapPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  mapEmoji: {
    fontSize: 32,
  },
  dotGrid: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    fontSize: 22,
  },
  subtext: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});

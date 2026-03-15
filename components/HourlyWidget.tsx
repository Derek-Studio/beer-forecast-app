import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HOURLY } from "../mockData";

type Props = { onPress: () => void };

export default function HourlyWidget({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.label}>HOURLY DRINK FORECAST</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
      <View style={styles.divider} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {HOURLY.map((slot) => (
          <View key={slot.time} style={styles.slot}>
            <Text style={styles.time}>{slot.time}</Text>
            <Text style={styles.emoji}>{slot.emoji}</Text>
            <Text style={styles.deal}>{slot.deal}</Text>
          </View>
        ))}
      </ScrollView>
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
    paddingBottom: 14,
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
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 10,
  },
  slot: {
    alignItems: "center",
    marginHorizontal: 8,
    minWidth: 44,
  },
  time: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },
  emoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  deal: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
});

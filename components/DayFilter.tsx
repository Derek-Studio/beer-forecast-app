import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAYS = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  selected: number | null; // null = All, 0=Mon...6=Sun
  onChange: (day: number | null) => void;
};

export default function DayFilter({ selected, onChange }: Props) {
  return (
    <View style={styles.strip}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {DAYS.map((label, i) => {
          const dayIndex = i === 0 ? null : i - 1;
          const active = selected === dayIndex;
          return (
            <TouchableOpacity
              key={label}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(dayIndex)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: "rgba(13,27,42,0.9)",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  row: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  chipActive: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  chipTextActive: {
    color: "#0D1B2A",
  },
});

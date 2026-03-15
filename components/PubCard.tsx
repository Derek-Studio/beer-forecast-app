import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PubSummary } from "../services/api";

type Props = {
  pub: PubSummary;
  onPress: () => void;
};

export default function PubCard({ pub, onPress }: Props) {
  const promoCount = pub.promotions?.length ?? 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.name}>{pub.name}</Text>
        <Text style={styles.address} numberOfLines={1}>
          {pub.address}
        </Text>
        {pub.distance_km != null && (
          <Text style={styles.distance}>{pub.distance_km.toFixed(1)} km away</Text>
        )}
      </View>
      {promoCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{promoCount}</Text>
          <Text style={styles.badgeLabel}>deals</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: "#999",
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  badgeLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
});

import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Promotion } from "../services/api";

type Props = { promo: Promotion };

export default function PromoCard({ promo }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.description}>{promo.description}</Text>
      {!!promo.discount && (
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>Discount </Text>
          <Text style={styles.discountValue}>{promo.discount}</Text>
        </View>
      )}
      <View style={styles.metaRow}>
        {!!promo.days && <Text style={styles.meta}>{promo.days}</Text>}
        {!!promo.days && !!promo.time && <Text style={styles.meta}> · </Text>}
        {!!promo.time && <Text style={styles.meta}>{promo.time}</Text>}
      </View>
      {!!promo.source_url && (
        <TouchableOpacity onPress={() => Linking.openURL(promo.source_url)}>
          <Text style={styles.link}>View source →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(245,158,11,0.15)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.35)",
  },
  description: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 6,
    fontWeight: "500",
    lineHeight: 21,
  },
  discountRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  discountValue: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  link: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "500",
  },
});

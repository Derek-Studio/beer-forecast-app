import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Promotion } from "../services/api";

type Props = {
  promo: Promotion;
};

export default function PromoCard({ promo }: Props) {
  const handleLink = () => {
    if (promo.source_url) {
      Linking.openURL(promo.source_url);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.description}>{promo.description}</Text>
      {!!promo.discount && (
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>Discount: </Text>
          <Text style={styles.discountValue}>{promo.discount}</Text>
        </View>
      )}
      <View style={styles.metaRow}>
        {!!promo.days && <Text style={styles.meta}>{promo.days}</Text>}
        {!!promo.days && !!promo.time && <Text style={styles.meta}> · </Text>}
        {!!promo.time && <Text style={styles.meta}>{promo.time}</Text>}
      </View>
      {!!promo.source_url && (
        <TouchableOpacity onPress={handleLink}>
          <Text style={styles.link}>View source →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  description: {
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 6,
    fontWeight: "500",
  },
  discountRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 13,
    color: "#666",
  },
  discountValue: {
    fontSize: 13,
    color: "#92400E",
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#999",
  },
  link: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "500",
  },
});

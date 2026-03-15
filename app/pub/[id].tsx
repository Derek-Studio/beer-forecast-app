import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PromoCard from "../../components/PromoCard";
import { usePub } from "../../hooks/usePubs";

export default function PubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: pub, isLoading, error } = usePub(Number(id));

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (error || !pub) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load pub details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{pub.name}</Text>
      <Text style={styles.address}>{pub.address}</Text>

      {pub.website && (
        <TouchableOpacity onPress={() => Linking.openURL(pub.website!)}>
          <Text style={styles.websiteLink}>{pub.website}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Promotions</Text>

      {!pub.promotions || pub.promotions.length === 0 ? (
        <Text style={styles.emptyText}>No promotions found yet.</Text>
      ) : (
        pub.promotions.map((promo, i) => (
          <PromoCard key={i} promo={promo} />
        ))
      )}

      {pub.promotions_last_updated && (
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(pub.promotions_last_updated).toLocaleDateString()}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  websiteLink: {
    fontSize: 14,
    color: "#2563EB",
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  lastUpdated: {
    color: "#bbb",
    fontSize: 12,
    marginTop: 16,
    textAlign: "right",
  },
});

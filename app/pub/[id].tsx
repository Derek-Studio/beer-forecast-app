import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
      <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </LinearGradient>
    );
  }

  if (error || !pub) {
    return (
      <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load pub details.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{pub.name}</Text>
        <Text style={styles.address}>{pub.address}</Text>
        {pub.website && (
          <TouchableOpacity onPress={() => Linking.openURL(pub.website!)}>
            <Text style={styles.websiteLink}>🌐 Website</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Today's Deals</Text>

        {!pub.promotions || pub.promotions.length === 0 ? (
          <Text style={styles.emptyText}>No promotions found yet. Clear skies, empty wallet.</Text>
        ) : (
          pub.promotions.map((promo, i) => <PromoCard key={i} promo={promo} />)
        )}

        {pub.promotions_last_updated && (
          <Text style={styles.lastUpdated}>
            Updated {new Date(pub.promotions_last_updated).toLocaleDateString()}
          </Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  content: { padding: 20, paddingTop: 24, paddingBottom: 48 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 4 },
  address: { fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 10 },
  websiteLink: { fontSize: 14, color: "#F59E0B", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "rgba(255,255,255,0.5)", letterSpacing: 0.6, marginBottom: 12, textTransform: "uppercase" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontStyle: "italic" },
  errorText: { color: "#dc2626", fontSize: 14 },
  lastUpdated: { color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 20, textAlign: "right" },
});

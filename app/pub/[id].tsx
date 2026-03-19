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
import DealCard from "../../components/DealCard";
import EventCard from "../../components/EventCard";
import { usePub } from "../../hooks/usePubs";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

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

  const sortedOpeningTimes = [...(pub.opening_times ?? [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.emoji}>{pub.venue_emoji ?? "🍺"}</Text>
        <Text style={styles.name}>{pub.name}</Text>
        <Text style={styles.address}>{pub.address}</Text>
        {pub.website && (
          <TouchableOpacity onPress={() => Linking.openURL(pub.website!)}>
            <Text style={styles.websiteLink}>🌐 Website</Text>
          </TouchableOpacity>
        )}

        {/* About */}
        {!!pub.venue_description?.text && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bodyText}>{pub.venue_description.text}</Text>
          </>
        )}

        {/* Opening Times */}
        {sortedOpeningTimes.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Opening Times</Text>
            {sortedOpeningTimes.map((ot) => (
              <View key={ot.day} style={styles.openingRow}>
                <Text style={styles.openingDay}>{DAY_LABELS[ot.day] ?? ot.day}</Text>
                <Text style={styles.openingTime}>{ot.open} – {ot.close}</Text>
              </View>
            ))}
          </>
        )}

        {/* Deals */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Deals</Text>
        {!pub.deals || pub.deals.length === 0 ? (
          <Text style={styles.emptyText}>No deals found yet.</Text>
        ) : (
          pub.deals.map((deal, i) => <DealCard key={i} deal={deal} />)
        )}

        {/* Events */}
        {pub.events && pub.events.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Events</Text>
            {pub.events.map((event, i) => <EventCard key={i} event={event} />)}
          </>
        )}

        {/* Facilities */}
        {pub.facilities && pub.facilities.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Facilities</Text>
            <View style={styles.pillRow}>
              {pub.facilities.map((f, i) => (
                <View key={i} style={styles.facilityPill}>
                  <Text style={styles.facilityText}>{f.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Social / Find Us */}
        {pub.social_media && pub.social_media.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Find Us</Text>
            {pub.social_media.map((sm, i) => (
              <TouchableOpacity key={i} onPress={() => sm.url && Linking.openURL(sm.url)} style={styles.socialRow}>
                <Text style={styles.socialPlatform}>{sm.platform}</Text>
                {!!sm.username && <Text style={styles.socialHandle}>@{sm.username}</Text>}
              </TouchableOpacity>
            ))}
          </>
        )}

        {pub.promotions_last_updated && (
          <Text style={styles.lastUpdated}>
            Updated {new Date(pub.promotions_last_updated).toLocaleDateString("en-GB")}
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
  emoji: { fontSize: 40, marginBottom: 4 },
  name: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 4 },
  address: { fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 10 },
  websiteLink: { fontSize: 14, color: "#F59E0B", marginBottom: 4 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  bodyText: { fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 21 },
  openingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  openingDay: { fontSize: 14, color: "rgba(255,255,255,0.6)", width: 48 },
  openingTime: { fontSize: 14, color: "#fff" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontStyle: "italic" },
  errorText: { color: "#dc2626", fontSize: 14 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityPill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  facilityText: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  socialRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  socialPlatform: { fontSize: 14, color: "rgba(255,255,255,0.5)", width: 100 },
  socialHandle: { fontSize: 14, color: "#60A5FA", fontWeight: "500" },
  lastUpdated: { color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 20, textAlign: "right" },
});

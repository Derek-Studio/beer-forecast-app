import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PubSummary } from "../services/api";

const MapView = Platform.OS !== "web" ? require("react-native-maps").default : null;
const Marker = Platform.OS !== "web" ? require("react-native-maps").Marker : null;

type Props = {
  onPress: () => void;
  pubCount: number;
  coords?: { lat: number; lng: number } | null;
  pubs?: PubSummary[];
};

function PubMarker({ pub }: { pub: PubSummary }) {
  const dealCount = pub.promotions?.length ?? 0;
  return (
    <View style={marker.container}>
      <Text style={marker.emoji}>{pub.venue_emoji ?? "🍻"}</Text>
      {dealCount > 0 && (
        <View style={marker.badge}>
          <Text style={marker.badgeText}>{dealCount}</Text>
        </View>
      )}
    </View>
  );
}

const marker = StyleSheet.create({
  container: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0D1B2A",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#0D1B2A",
  },
});

export default function MapWidget({ onPress, pubCount, coords, pubs }: Props) {
  const center = coords ?? { lat: 51.5074, lng: -0.1278 };

  const region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {MapView ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <MapView
            style={StyleSheet.absoluteFill}
            region={region}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={!!coords}
            showsCompass={false}
            showsScale={false}
            showsPointsOfInterest={true}
            toolbarEnabled={false}
            moveOnMarkerPress={false}
          >
            {pubs?.map((pub) =>
              Marker ? (
                <Marker
                  key={pub.id}
                  coordinate={{ latitude: pub.lat, longitude: pub.lng }}
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <PubMarker pub={pub} />
                </Marker>
              ) : null
            )}
          </MapView>

          <LinearGradient
            colors={["rgba(13,27,42,0.72)", "rgba(13,27,42,0.0)", "rgba(13,27,42,0.55)"]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.webFallback]} />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>NEARBY PUBS</Text>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.spacer} />

      {/* Footer pill */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {pubCount > 0 ? `${pubCount} pubs within 2km` : "Locating pubs…"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
    marginBottom: 12,
    height: 180,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  webFallback: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.8,
  },
  chevron: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
  },
  spacer: {
    flex: 1,
  },
  footer: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  footerText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});

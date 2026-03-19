import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNearbyPubs } from "../hooks/usePubs";
import { PubSummary } from "../services/api";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const FOV = 60; // degrees horizontal field of view

function toRad(d: number) { return (d * Math.PI) / 180; }

function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2))
    - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// ─── Web AR component ────────────────────────────────────────────────────────
function WebAR({ pub, coords }: { pub: PubSummary; coords: { lat: number; lng: number } }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [camError, setCamError] = useState(false);
  const [orientationError, setOrientationError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => setCamError(true));
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const h = (e as any).webkitCompassHeading ?? (e.alpha != null ? (360 - e.alpha) % 360 : null);
      if (h != null) setHeading(h);
    };
    if (typeof DeviceOrientationEvent !== "undefined" && (DeviceOrientationEvent as any).requestPermission) {
      (DeviceOrientationEvent as any).requestPermission().then(() => {
        window.addEventListener("deviceorientation", handler, true);
      }).catch(() => setOrientationError(true));
    } else {
      window.addEventListener("deviceorientation", handler, true);
      // If no events fire within 1s, mark as unavailable
      const timer = setTimeout(() => setOrientationError(true), 1500);
      const firstEvent = () => { clearTimeout(timer); window.removeEventListener("deviceorientation", firstEvent); };
      window.addEventListener("deviceorientation", firstEvent);
    }
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, []);

  const pubBearing = bearing(coords.lat, coords.lng, pub.lat, pub.lng);
  const dist = distanceKm(coords.lat, coords.lng, pub.lat, pub.lng);
  const distLabel = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;

  // Horizontal offset based on bearing difference
  let xPos = SCREEN_W / 2;
  if (heading !== null) {
    let diff = ((pubBearing - heading) + 540) % 360 - 180; // -180..180
    xPos = SCREEN_W / 2 + (diff / (FOV / 2)) * (SCREEN_W / 2);
    xPos = Math.max(40, Math.min(SCREEN_W - 40, xPos));
  }

  return (
    <View style={styles.container}>
      {/* Camera feed */}
      {!camError ? (
        <video
          ref={videoRef as any}
          autoPlay
          playsInline
          muted
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <View style={styles.noCam}>
          <Text style={styles.noCamText}>📷 Camera unavailable</Text>
        </View>
      )}

      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Pub marker */}
      <View style={[styles.pubMarker, { left: xPos - 50, top: SCREEN_H * 0.35 }]}>
        <Text style={styles.pubEmoji}>{pub.venue_emoji ?? "🍺"}</Text>
        <View style={styles.pubLabel}>
          <Text style={styles.pubName}>{pub.name}</Text>
          <Text style={styles.pubDist}>{distLabel} away</Text>
        </View>
        {heading !== null && <View style={styles.dirLine} />}
      </View>

      {/* Compass / heading indicator */}
      {heading !== null ? (
        <View style={styles.compassRow}>
          <Text style={styles.compassText}>↑ {Math.round(heading)}°</Text>
          <Text style={styles.compassSub}>Pub at {Math.round(pubBearing)}°</Text>
        </View>
      ) : orientationError ? (
        <View style={styles.compassRow}>
          <Text style={styles.compassSub}>Compass unavailable — point your phone toward the pub</Text>
        </View>
      ) : (
        <View style={styles.compassRow}>
          <Text style={styles.compassSub}>Waiting for compass…</Text>
        </View>
      )}

      {/* Deals badge */}
      {(pub.deals?.length > 0 || pub.events?.length > 0) && (
        <View style={styles.dealsBadge}>
          <Text style={styles.dealsText}>
            {pub.deals?.length > 0 ? `🍻 ${pub.deals.length} deal${pub.deals.length > 1 ? "s" : ""}` : ""}
            {pub.deals?.length > 0 && pub.events?.length > 0 ? "  ·  " : ""}
            {pub.events?.length > 0 ? `🎉 ${pub.events.length} event${pub.events.length > 1 ? "s" : ""}` : ""}
          </Text>
        </View>
      )}

      {/* Back + Go buttons */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBtn} onPress={() => router.push(`/pub/${pub.id}`)}>
        <Text style={styles.goText}>View pub →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ArPubScreen() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { data: pubs } = useNearbyPubs(coords?.lat ?? null, coords?.lng ?? null, 5);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  if (!coords) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingEmoji}>🍺</Text>
        <Text style={styles.loadingText}>Finding your location…</Text>
      </View>
    );
  }

  // Nearest pub
  const nearest = pubs && pubs.length > 0
    ? pubs.reduce((a, b) =>
        distanceKm(coords.lat, coords.lng, a.lat, a.lng) <
        distanceKm(coords.lat, coords.lng, b.lat, b.lng) ? a : b
      )
    : null;

  if (!nearest) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingEmoji}>🔍</Text>
        <Text style={styles.loadingText}>Finding nearest pub…</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return <WebAR pub={nearest} coords={coords} />;
  }

  // Native fallback — compass direction card (full AR on native would need expo-camera)
  const pubBearing = bearing(coords.lat, coords.lng, nearest.lat, nearest.lng);
  const dist = distanceKm(coords.lat, coords.lng, nearest.lat, nearest.lng);
  const distLabel = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const dirLabel = dirs[Math.round(pubBearing / 45) % 8];

  return (
    <View style={[styles.container, styles.center, { backgroundColor: "#0D1B2A" }]}>
      <Text style={styles.pubEmoji}>{nearest.venue_emoji ?? "🍺"}</Text>
      <Text style={styles.pubName}>{nearest.name}</Text>
      <Text style={styles.pubDist}>{distLabel} · {dirLabel}</Text>
      <View style={styles.compassDial}>
        <Text style={[styles.dialArrow, { transform: [{ rotate: `${pubBearing}deg` }] }]}>↑</Text>
      </View>
      <TouchableOpacity style={styles.goBtn} onPress={() => router.push(`/pub/${nearest.id}`)}>
        <Text style={styles.goText}>View pub →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  noCam: { flex: 1, backgroundColor: "#0D1B2A", justifyContent: "center", alignItems: "center" },
  noCamText: { color: "rgba(255,255,255,0.5)", fontSize: 16 },
  pubMarker: { position: "absolute", width: 100, alignItems: "center" },
  pubEmoji: { fontSize: 56, textShadowColor: "rgba(0,0,0,0.6)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  pubLabel: { alignItems: "center", marginTop: 6 },
  pubName: { color: "#fff", fontWeight: "700", fontSize: 13, textAlign: "center", textShadowColor: "#000", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  pubDist: { color: "#F59E0B", fontSize: 12, fontWeight: "600", marginTop: 2 },
  dirLine: { width: 2, height: 60, backgroundColor: "rgba(245,158,11,0.6)", marginTop: 4, borderRadius: 1 },
  compassRow: { position: "absolute", top: 60, alignSelf: "center", alignItems: "center" },
  compassText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  compassSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2, textAlign: "center", paddingHorizontal: 20 },
  dealsBadge: { position: "absolute", bottom: 110, alignSelf: "center", backgroundColor: "rgba(245,158,11,0.2)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(245,158,11,0.4)", paddingVertical: 8, paddingHorizontal: 20 },
  dealsText: { color: "#F59E0B", fontSize: 14, fontWeight: "600" },
  backBtn: { position: "absolute", top: 56, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  backText: { color: "#fff", fontSize: 16 },
  goBtn: { position: "absolute", bottom: 50, alignSelf: "center", backgroundColor: "#F59E0B", borderRadius: 25, paddingVertical: 14, paddingHorizontal: 40 },
  goText: { color: "#000", fontWeight: "700", fontSize: 16 },
  loadingEmoji: { fontSize: 64, marginBottom: 16 },
  loadingText: { color: "rgba(255,255,255,0.6)", fontSize: 16 },
  compassDial: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "rgba(245,158,11,0.4)", justifyContent: "center", alignItems: "center", marginTop: 24, marginBottom: 32 },
  dialArrow: { fontSize: 48, color: "#F59E0B" },
});

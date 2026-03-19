import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Beernado track — starts over Atlantic, makes landfall at London
const TRACK = [
  { lat: 51.5, lng: -28.0, label: "Origin" },
  { lat: 51.8, lng: -22.0 },
  { lat: 52.1, lng: -16.0 },
  { lat: 52.0, lng: -10.0 },
  { lat: 51.8, lng: -5.5 },
  { lat: 51.7, lng: -2.0 },
  { lat: 51.5074, lng: -0.1278, label: "London 🎯" },
];

const LONDON = { lat: 51.5074, lng: -0.1278 };

// Storm progresses along the track over time
const STORM_SPEED_MS = 3000; // move to next waypoint every 3s

// ─── Web implementation ───────────────────────────────────────────────────────
function BeernadoWeb() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [stormIdx, setStormIdx] = useState(0);
  const spinRef = useRef(0);
  const [spinDeg, setSpinDeg] = useState(0);

  useEffect(() => {
    const id = "leaflet-css";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    setReady(true);
  }, []);

  // Advance storm along track
  useEffect(() => {
    if (stormIdx >= TRACK.length - 1) return;
    const t = setTimeout(() => setStormIdx(i => Math.min(i + 1, TRACK.length - 1)), STORM_SPEED_MS);
    return () => clearTimeout(t);
  }, [stormIdx]);

  // Spin the emoji
  useEffect(() => {
    let frame: number;
    const spin = () => {
      spinRef.current = (spinRef.current + 2) % 360;
      setSpinDeg(spinRef.current);
      frame = requestAnimationFrame(spin);
    };
    frame = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!ready) return null;

  const { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } = require("react-leaflet");
  const L = require("leaflet");

  const stormPos = TRACK[stormIdx];
  const remainingTrack = TRACK.slice(stormIdx);
  const pastTrack = TRACK.slice(0, stormIdx + 1);

  const beernadoIcon = L.divIcon({
    html: `<div style="font-size:36px;transform:rotate(${spinDeg}deg);filter:drop-shadow(0 0 8px rgba(245,158,11,0.8));line-height:1">🌀</div>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  const londonIcon = L.divIcon({
    html: `<div style="font-size:28px;filter:drop-shadow(0 0 6px rgba(220,38,38,0.9));line-height:1">🎯</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const isAtLondon = stormIdx === TRACK.length - 1;
  const etaSteps = TRACK.length - 1 - stormIdx;
  const etaMin = Math.round((etaSteps * STORM_SPEED_MS) / 60000);

  return (
    <View style={styles.container}>
      <MapContainer
        center={[51.5, -8]}
        zoom={5}
        style={{ flex: 1, height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* Dark storm-tracker tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* Past track — solid amber */}
        <Polyline
          positions={pastTrack.map(p => [p.lat, p.lng])}
          color="#F59E0B"
          weight={3}
          opacity={0.8}
        />

        {/* Forecast track — dashed red */}
        <Polyline
          positions={remainingTrack.map(p => [p.lat, p.lng])}
          color="#dc2626"
          weight={3}
          opacity={0.9}
          dashArray="8 6"
        />

        {/* Cone of uncertainty */}
        {remainingTrack.length > 1 && (
          <Polyline
            positions={[
              ...remainingTrack.map(p => [p.lat + 0.8 * (remainingTrack.indexOf({...p}) / remainingTrack.length + 0.2), p.lng]),
              ...[...remainingTrack].reverse().map(p => [p.lat - 0.8 * (remainingTrack.indexOf({...p}) / remainingTrack.length + 0.2), p.lng]),
            ]}
            color="rgba(220,38,38,0.15)"
            fill
            fillOpacity={0.15}
            weight={0}
          />
        )}

        {/* London target pulse */}
        <Circle center={[LONDON.lat, LONDON.lng]} radius={30000} color="#dc2626" fillColor="#dc2626" fillOpacity={0.08} weight={1} />
        <Circle center={[LONDON.lat, LONDON.lng]} radius={15000} color="#dc2626" fillColor="#dc2626" fillOpacity={0.12} weight={1} />

        {/* London marker */}
        <Marker position={[LONDON.lat, LONDON.lng]} icon={londonIcon} />

        {/* Storm marker */}
        <Marker position={[stormPos.lat, stormPos.lng]} icon={beernadoIcon}>
          <Popup>🌀 Beernado Cat. 5</Popup>
        </Marker>
      </MapContainer>

      {/* HUD overlay */}
      <View style={styles.hud} pointerEvents="none">
        <Text style={styles.hudTitle}>🌀 BEERNADO ALERT</Text>
        <Text style={styles.hudSub}>Category 5 — Beer Storm</Text>
        {isAtLondon ? (
          <Text style={styles.hudEta}>⚠️ LANDFALL — LONDON</Text>
        ) : (
          <Text style={styles.hudEta}>ETA London: ~{etaMin < 1 ? "<1" : etaMin} min</Text>
        )}
      </View>

      {/* Spinning beer label */}
      <View style={styles.beernadoLabel} pointerEvents="none">
        <Text style={styles.beernadoEmoji}>🌀</Text>
        <Text style={[styles.beerLabel, { transform: [{ rotate: `${spinDeg}deg` }] as any }]}>🍺</Text>
      </View>

      {/* Alert card */}
      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>{isAtLondon ? "🍺 LANDFALL IMMINENT" : "🌊 STORM APPROACHING"}</Text>
        <Text style={styles.alertBody}>
          {isAtLondon
            ? "Seek shelter in nearest pub immediately."
            : `Beernado tracking toward London via the North Atlantic. Expect heavy pints.`}
        </Text>
        <TouchableOpacity style={styles.alertBtn} onPress={() => router.push("/ar-pub")}>
          <Text style={styles.alertBtnText}>🍺 Find nearest pub →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Native fallback ──────────────────────────────────────────────────────────
function BeernadoNative() {
  const router = useRouter();
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.linear })
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={[styles.container, { backgroundColor: "#0D1B2A", justifyContent: "center", alignItems: "center" }]}>
      <Text style={styles.hudTitle}>🌀 BEERNADO ALERT</Text>
      <Text style={styles.nativeSpin}>🌀</Text>
      <Animated.Text style={[styles.beerLabel, { transform: [{ rotate }] }]}>🍺</Animated.Text>
      <Text style={styles.alertBody}>Category 5 Beer Storm approaching London</Text>
      <TouchableOpacity style={[styles.alertBtn, { marginTop: 32 }]} onPress={() => router.push("/ar-pub")}>
        <Text style={styles.alertBtnText}>🍺 Find nearest pub →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BeernadoScreen() {
  return Platform.OS === "web" ? <BeernadoWeb /> : <BeernadoNative />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hud: {
    position: "absolute",
    top: 56,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.5)",
  },
  hudTitle: { color: "#dc2626", fontSize: 16, fontWeight: "800", letterSpacing: 2 },
  hudSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 },
  hudEta: { color: "#F59E0B", fontSize: 13, fontWeight: "600", marginTop: 4 },
  beernadoLabel: {
    position: "absolute",
    top: "38%",
    alignSelf: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  beernadoEmoji: { fontSize: 48 },
  beerLabel: { fontSize: 32, marginTop: -8 },
  alertCard: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: "rgba(13,27,42,0.92)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.4)",
  },
  alertTitle: { color: "#dc2626", fontSize: 15, fontWeight: "800", marginBottom: 6 },
  alertBody: { color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 19, marginBottom: 14 },
  alertBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  alertBtnText: { color: "#000", fontWeight: "700", fontSize: 15 },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { color: "#fff", fontSize: 16 },
  nativeSpin: { fontSize: 80, marginVertical: 24 },
});

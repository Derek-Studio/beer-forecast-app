import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapFilters from "../components/MapFilters";
import { PubMarker } from "../components/PubMarker";
import { useNearbyPubs } from "../hooks/usePubs";
import { PubSummary } from "../services/api";
import { pubHasDealOnDay } from "../utils/dealDays";

const CATEGORY_MAP: Record<string, string[]> = {
  happy_hour:       ["happy hour"],
  free_drink:       ["free item"],
  two_for_one:      ["2-for-1"],
  discounted:       ["drink special", "discount", "meal deal", "loyalty offer"],
  pub_quiz:         ["quiz night"],
  live_music:       ["live music", "open mic", "DJ set"],
  karaoke:          ["karaoke"],
  comedy:           ["comedy night"],
  sports_screening: ["sports screening"],
  bingo_games:      ["bingo", "games night"],
  themed_night:     ["themed night"],
  other:            ["other"],
};

const TIME_RANGES: Record<string, [number, number]> = {
  day_drinking:  [9,  17],
  evening:       [17, 21],
  late_drinking: [20, 23],
  nightlife:     [22, 26],
};

function pubMatchesTypeFilter(pub: PubSummary, selectedTypes: string[]): boolean {
  if (selectedTypes.length === 0) return true;
  const categories = [
    ...(pub.deals?.map(d => d.category) ?? []),
    ...(pub.events?.map(e => e.category) ?? []),
  ];
  return selectedTypes.some(t =>
    CATEGORY_MAP[t]?.some(c => categories.includes(c))
  );
}

function pubMatchesTimeFilter(pub: PubSummary, selectedTimes: string[]): boolean {
  if (selectedTimes.length === 0) return true;
  const allSchedules = [
    ...(pub.deals?.map(d => d.schedule) ?? []),
    ...(pub.events?.map(e => e.schedule) ?? []),
  ];
  return selectedTimes.some(t => {
    const [filterStart, filterEnd] = TIME_RANGES[t];
    return allSchedules.some(s => {
      if (!s) return false;
      if (s.all_day || (!s.time_open && !s.time_close)) return true;
      const start = s.time_open ? parseInt(s.time_open.split(":")[0]) : 0;
      let end = s.time_close ? parseInt(s.time_close.split(":")[0]) : 24;
      if (end <= start) end += 24; // midnight-crossing fix
      return start < filterEnd && end > filterStart;
    });
  });
}

const NativeMapView = Platform.OS !== "web" ? require("react-native-maps").default : null;
const NativeMarker = Platform.OS !== "web" ? require("react-native-maps").Marker : null;

const DAY_TO_NUM: Record<string, number> = {
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
  st_patricks: 0, // 17 Mar 2026 is a Monday
};

function WebMap({ pubs, center, selectedDays, selectedTypes, selectedTimes }: {
  pubs: any[];
  center: [number, number];
  selectedDays: string[];
  selectedTypes: string[];
  selectedTimes: string[];
}) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = "leaflet-css";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");

  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer center={center} zoom={14} style={{ flex: 1, height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {pubs.map((pub: any) => {
        const dayOk = selectedDays.length === 0 || selectedDays.some((d) => pubHasDealOnDay(pub, DAY_TO_NUM[d]));
        const typeOk = pubMatchesTypeFilter(pub, selectedTypes);
        const timeOk = pubMatchesTimeFilter(pub, selectedTimes);
        if (!dayOk || !typeOk || !timeOk) return null;
        return (
          <Marker key={pub.id} position={[pub.lat, pub.lng]} icon={icon}>
            <Popup>
              <strong>{pub.name}</strong><br />
              {pub.address}<br />
              <a href="#" onClick={(e: any) => { e.preventDefault(); router.push(`/pub/${pub.id}`); }}>
                View deals →
              </a>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [locationLabel, setLocationLabel] = useState<string>("");
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }
    })();
  }, []);

  const { data: pubs } = useNearbyPubs(coords?.lat ?? null, coords?.lng ?? null);
  const center: [number, number] = coords ? [coords.lat, coords.lng] : [51.5074, -0.1278];

  async function updateLocationLabel(lat: number, lng: number, latDelta: number) {
    const [result] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (!result) return;
    // Zoomed in: use district/neighbourhood; zoomed out: use city
    const label = latDelta < 0.05
      ? (result.district || result.subregion || result.city || "")
      : (result.city || result.subregion || "");
    setLocationLabel(label);
    navigation.setOptions({ title: label ? `${label} Pubs` : "Nearby Pubs" });
  }

  function handleRegionChangeComplete(r: { latitude: number; longitude: number; latitudeDelta: number }) {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(() => {
      updateLocationLabel(r.latitude, r.longitude, r.latitudeDelta);
    }, 400);
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <MapFilters
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          selectedTimes={selectedTimes}
          onTimesChange={setSelectedTimes}
        />
        <WebMap pubs={pubs ?? []} center={center} selectedDays={selectedDays} selectedTypes={selectedTypes} selectedTimes={selectedTimes} />
      </View>
    );
  }

  const region = {
    latitude: center[0],
    longitude: center[1],
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  return (
    <LinearGradient colors={["#0D1B2A", "#1C3F6E"]} style={styles.gradient}>
      <View style={styles.container}>
        <MapFilters
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
          selectedTimes={selectedTimes}
          onTimesChange={setSelectedTimes}
        />
        {NativeMapView && (
          <NativeMapView
            style={styles.map}
            region={region}
            showsUserLocation
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            {NativeMarker && [...(pubs ?? [])]
              .sort((a, b) => {
                const aActive = (selectedDays.length === 0 || selectedDays.some((d) => pubHasDealOnDay(a, DAY_TO_NUM[d])))
                  && pubMatchesTypeFilter(a, selectedTypes)
                  && pubMatchesTimeFilter(a, selectedTimes);
                const bActive = (selectedDays.length === 0 || selectedDays.some((d) => pubHasDealOnDay(b, DAY_TO_NUM[d])))
                  && pubMatchesTypeFilter(b, selectedTypes)
                  && pubMatchesTimeFilter(b, selectedTimes);
                return Number(aActive) - Number(bActive); // inactive first → active on top
              })
              .map((pub: any) => {
                const hasDeals = (selectedDays.length === 0 || selectedDays.some((d) => pubHasDealOnDay(pub, DAY_TO_NUM[d])))
                  && pubMatchesTypeFilter(pub, selectedTypes)
                  && pubMatchesTimeFilter(pub, selectedTimes);
                const dealCount = (pub.deals?.length ?? 0) + (pub.events?.length ?? 0);
                return (
                  <NativeMarker
                    key={pub.id}
                    coordinate={{ latitude: pub.lat, longitude: pub.lng }}
                    tracksViewChanges={false}
                    anchor={{ x: 0.5, y: 0.5 }}
                    onPress={() => router.push(`/pub/${pub.id}`)}
                  >
                    <PubMarker
                      emoji={pub.venue_emoji ?? "🍻"}
                      dealCount={dealCount}
                      variant="A"
                      active={hasDeals}
                    />
                  </NativeMarker>
                );
              })}
          </NativeMapView>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  map: { flex: 1 },
});

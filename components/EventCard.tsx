import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../constants";
import { Event } from "../services/api";

const THUMBNAIL_MIN_HEIGHT = 120;

type Props = { event: Event };

function formatSourceUrl(url: string): string {
  let s = url.replace(/^https?:\/\/(www\.)?/, "");
  if (s.length > 20) s = s.slice(0, 19) + "…";
  return s;
}

function formatSchedule(event: Event): string {
  const s = event.schedule;
  if (!s) return "";
  if (!s.recurring && s.date) {
    const d = new Date(s.date);
    const dateStr = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    if (s.time_open) return `${dateStr} · ${s.time_open}${s.time_close ? " – " + s.time_close : ""}`;
    return dateStr;
  }
  const days = s.days.length === 0 ? "Daily" : s.days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(", ");
  const time = s.time_open ? `${s.time_open}${s.time_close ? " – " + s.time_close : ""}` : "All day";
  return `${days} · ${time}`;
}

export default function EventCard({ event }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const screenshotUri = event.screenshot_path
    ? API_BASE_URL + event.screenshot_path
    : null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>
      {!!event.description && (
        <Text style={styles.description}>{event.description}</Text>
      )}
      {!!event.category && (
        <View style={styles.categoryRow}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        </View>
      )}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{formatSchedule(event)}</Text>
      </View>
      {!!screenshotUri && (
        <>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
            style={styles.thumbnailWrapper}
          >
            <Image
              source={{ uri: screenshotUri }}
              style={[styles.thumbnail, {
                height: Math.max(event.screenshot_min_height ?? 0, THUMBNAIL_MIN_HEIGHT)
              }]}
              resizeMode="cover"
            />
            {!!event.source_url && (
              <TouchableOpacity
                style={styles.urlPill}
                onPress={(e) => { e.stopPropagation(); Linking.openURL(event.source_url); }}
                activeOpacity={0.75}
              >
                <Text style={styles.urlPillText}>{formatSourceUrl(event.source_url)}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <Image
                source={{ uri: screenshotUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Modal>
        </>
      )}
      {!screenshotUri && !!event.source_url && (
        <TouchableOpacity onPress={() => Linking.openURL(event.source_url)}>
          <Text style={styles.sourceLink}>{formatSourceUrl(event.source_url)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(59,130,246,0.15)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.35)",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: "rgba(59,130,246,0.3)",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: 12,
    color: "#60A5FA",
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
  thumbnailWrapper: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  urlPill: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  urlPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  thumbnail: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "95%",
    height: "80%",
  },
  sourceLink: {
    fontSize: 12,
    color: "rgba(96,165,250,0.7)",
    marginTop: 4,
  },
});

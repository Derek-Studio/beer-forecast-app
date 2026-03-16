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
import { Promotion } from "../services/api";

type Props = { promo: Promotion };

function formatSourceUrl(url: string): string {
  let s = url.replace(/^https?:\/\/(www\.)?/, "");
  if (s.length > 20) s = s.slice(0, 19) + "…";
  return s;
}

export default function PromoCard({ promo }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const screenshotUri = promo.screenshot_url
    ? API_BASE_URL + promo.screenshot_url
    : null;

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
      {!!screenshotUri && (
        <>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
            style={styles.thumbnailWrapper}
          >
            <Image
              source={{ uri: screenshotUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            {!!promo.source_url && (
              <TouchableOpacity
                style={styles.urlPill}
                onPress={(e) => { e.stopPropagation(); Linking.openURL(promo.source_url); }}
                activeOpacity={0.75}
              >
                <Text style={styles.urlPillText}>{formatSourceUrl(promo.source_url)}</Text>
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
    height: 100,
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
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type MarkerVariant = "A" | "B" | "C";

interface Props {
  emoji: string;
  dealCount: number;
  variant: MarkerVariant;
  active?: boolean;
}

function VariantA({ emoji, dealCount, active }: Omit<Props, "variant">) {
  return (
    <View style={[pillStyles.pill, !active && pillStyles.pillDim]}>
      <Text style={pillStyles.emoji}>{emoji}</Text>
      {dealCount > 0 && (
        <Text style={pillStyles.count}> · {dealCount}</Text>
      )}
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13,27,42,0.92)",
    borderRadius: 14,
    height: 28,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pillDim: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 14,
  },
  count: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F59E0B",
  },
});

function VariantB({ emoji, dealCount, active }: Omit<Props, "variant">) {
  const hasDeals = dealCount > 0 && active;
  const fill = hasDeals ? "#F59E0B" : "rgba(28,63,110,0.9)";
  return (
    <View style={[pinStyles.wrapper, !active && pinStyles.wrapperDim]}>
      <View style={[pinStyles.circle, { backgroundColor: fill }]}>
        <Text style={pinStyles.emoji}>{emoji}</Text>
      </View>
      <View style={[pinStyles.tail, { borderTopColor: fill }]} />
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  wrapperDim: {
    opacity: 0.4,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  emoji: {
    fontSize: 18,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

function VariantC({ dealCount, active }: Omit<Props, "variant" | "emoji">) {
  const hasDeals = dealCount > 0 && active;
  if (!hasDeals) {
    return <View style={chipStyles.dot} />;
  }
  return (
    <View style={chipStyles.chip}>
      <Text style={chipStyles.count}>{dealCount}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  count: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0D1B2A",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(13,27,42,0.6)",
  },
});

export function PubMarker({ emoji, dealCount, variant, active = true }: Props) {
  if (variant === "B") return <VariantB emoji={emoji} dealCount={dealCount} active={active} />;
  if (variant === "C") return <VariantC emoji={emoji} dealCount={dealCount} active={active} />;
  return <VariantA emoji={emoji} dealCount={dealCount} active={active} />;
}

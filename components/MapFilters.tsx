import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Data types ───────────────────────────────────────────────────────────────

interface LeafOption {
  label: string;
  sublabel?: string;
  value: string;
}

interface OptionGroup {
  groupLabel: string;
  groupKey: string;
  options: LeafOption[];
}

// ─── Day filter ───────────────────────────────────────────────────────────────

const DAY_GROUPS: OptionGroup[] = [
  {
    groupLabel: "Upcoming Holidays",
    groupKey: "holidays",
    options: [
      { label: "St. Patrick's Day", sublabel: "Mon 17 Mar", value: "st_patricks" },
    ],
  },
  {
    groupLabel: "Weekdays",
    groupKey: "weekdays",
    options: [
      { label: "Monday",    value: "mon" },
      { label: "Tuesday",   value: "tue" },
      { label: "Wednesday", value: "wed" },
      { label: "Thursday",  value: "thu" },
      { label: "Friday",    value: "fri" },
    ],
  },
  {
    groupLabel: "Weekend",
    groupKey: "weekend",
    options: [
      { label: "Saturday", value: "sat" },
      { label: "Sunday",   value: "sun" },
    ],
  },
];

// ─── Time filter ──────────────────────────────────────────────────────────────

const TIME_GROUPS: OptionGroup[] = [
  {
    groupLabel: "Daytime",
    groupKey: "daytime",
    options: [
      { label: "Day Drinking", sublabel: "09:00 – 17:00", value: "day_drinking" },
    ],
  },
  {
    groupLabel: "Nighttime",
    groupKey: "nighttime",
    options: [
      { label: "Evening",       sublabel: "17:00 – 21:00", value: "evening" },
      { label: "Late Drinking", sublabel: "20:00 – 23:00", value: "late_drinking" },
      { label: "Nightlife",     sublabel: "22:00 – close", value: "nightlife" },
    ],
  },
];

// ─── Type filter ──────────────────────────────────────────────────────────────

const TYPE_GROUPS: OptionGroup[] = [
  {
    groupLabel: "Discounts",
    groupKey: "discounts",
    options: [
      { label: "Happy Hour", value: "happy_hour" },
      { label: "Free Drink", value: "free_drink" },
      { label: "2-for-1",    value: "two_for_one" },
      { label: "Discounted", value: "discounted" },
    ],
  },
  {
    groupLabel: "Events",
    groupKey: "events",
    options: [
      { label: "Pub Quiz",         value: "pub_quiz" },
      { label: "Live Music",       value: "live_music" },
      { label: "Karaoke",          value: "karaoke" },
      { label: "Comedy",           value: "comedy" },
      { label: "Sports Screening", value: "sports_screening" },
      { label: "Bingo & Games",    value: "bingo_games" },
      { label: "Themed Night",     value: "themed_night" },
      { label: "Other",            value: "other" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupState(group: OptionGroup, selected: string[]): "full" | "partial" | "none" {
  const vals = group.options.map((o) => o.value);
  const count = vals.filter((v) => selected.includes(v)).length;
  if (count === 0) return "none";
  if (count === vals.length) return "full";
  return "partial";
}

function pillLabel(groups: OptionGroup[], selected: string[], anyLabel: string): string {
  if (selected.length === 0) return anyLabel;
  for (const g of groups) {
    const vals = g.options.map((o) => o.value);
    if (vals.length === selected.length && vals.every((v) => selected.includes(v))) {
      return g.groupLabel;
    }
  }
  if (selected.length === 1) {
    const all = groups.flatMap((g) => g.options);
    const match = all.find((o) => o.value === selected[0]);
    if (match) return match.label;
  }
  return `${selected.length} selected`;
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

function Checkbox({ state }: { state: "full" | "partial" | "none" }) {
  return (
    <View style={[cb.box, state === "full" && cb.full, state === "partial" && cb.partial]}>
      {state === "full" && <Text style={cb.tick}>✓</Text>}
      {state === "partial" && <View style={cb.dash} />}
    </View>
  );
}

const cb = StyleSheet.create({
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  full: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  partial: {
    backgroundColor: "rgba(245,158,11,0.2)",
    borderColor: "#F59E0B",
  },
  tick: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  dash: {
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#F59E0B",
  },
});

// ─── Multi-select dropdown ────────────────────────────────────────────────────

interface DropdownProps {
  icon: string;
  anyLabel: string;
  groups: OptionGroup[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function MultiSelectDropdown({ icon, anyLabel, groups, selected, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const isAny = selected.length === 0;
  const label = pillLabel(groups, selected, anyLabel);

  function toggleGroup(group: OptionGroup) {
    const vals = group.options.map((o) => o.value);
    const allOn = vals.every((v) => selected.includes(v));
    if (allOn) {
      onChange(selected.filter((v) => !vals.includes(v)));
    } else {
      const merged = [...selected];
      vals.forEach((v) => { if (!merged.includes(v)) merged.push(v); });
      onChange(merged);
    }
  }

  function toggleLeaf(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.pill, !isAny && styles.pillActive, open && styles.pillOpen]}
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.pillIcon}>{icon}</Text>
        <Text style={[styles.pillText, !isAny && styles.pillTextActive]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.pillCaret, !isAny && styles.pillCaretActive]}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {/* Any row */}
            <TouchableOpacity
              style={[styles.anyRow, isAny && styles.anyRowActive]}
              onPress={() => onChange([])}
              activeOpacity={0.7}
            >
              <Checkbox state={isAny ? "full" : "none"} />
              <Text style={[styles.anyText, isAny && styles.anyTextActive]}>{anyLabel}</Text>
            </TouchableOpacity>

            <View style={styles.sectionDivider} />

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {groups.map((group, gi) => {
                const gState = groupState(group, selected);
                return (
                  <View key={group.groupKey}>
                    {gi > 0 && <View style={styles.groupDivider} />}

                    {/* Group header */}
                    <TouchableOpacity
                      style={styles.groupRow}
                      onPress={() => toggleGroup(group)}
                      activeOpacity={0.7}
                    >
                      <Checkbox state={gState} />
                      <Text style={[styles.groupText, gState !== "none" && styles.groupTextActive]}>
                        {group.groupLabel}
                      </Text>
                    </TouchableOpacity>

                    {/* Leaf options */}
                    {group.options.map((opt) => {
                      const on = selected.includes(opt.value);
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.leafRow, on && styles.leafRowActive]}
                          onPress={() => toggleLeaf(opt.value)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.leafIndent} />
                          <Checkbox state={on ? "full" : "none"} />
                          <View style={styles.leafTextWrap}>
                            <Text style={[styles.leafText, on && styles.leafTextActive]}>
                              {opt.label}
                            </Text>
                            {opt.sublabel ? (
                              <Text style={[styles.leafSub, on && styles.leafSubActive]}>
                                {opt.sublabel}
                              </Text>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ─── MapFilters bar ───────────────────────────────────────────────────────────

type Props = {
  selectedTypes: string[];
  onTypesChange: (v: string[]) => void;
  selectedDays: string[];
  onDaysChange: (v: string[]) => void;
  selectedTimes: string[];
  onTimesChange: (v: string[]) => void;
  rightSlot?: React.ReactNode;
};

export default function MapFilters({
  selectedTypes, onTypesChange,
  selectedDays, onDaysChange,
  selectedTimes, onTimesChange,
  rightSlot,
}: Props) {
  return (
    <View style={styles.bar}>
      <MultiSelectDropdown
        icon="🏷"
        anyLabel="All Types"
        groups={TYPE_GROUPS}
        selected={selectedTypes}
        onChange={onTypesChange}
      />
      <MultiSelectDropdown
        icon="📅"
        anyLabel="Any Day"
        groups={DAY_GROUPS}
        selected={selectedDays}
        onChange={onDaysChange}
      />
      <MultiSelectDropdown
        icon="🕐"
        anyLabel="Any Time"
        groups={TIME_GROUPS}
        selected={selectedTimes}
        onChange={onTimesChange}
      />
      <View style={styles.flex} />
      {rightSlot}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(13,27,42,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  flex: { flex: 1 },

  // Pill
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  pillActive: {
    backgroundColor: "rgba(245,158,11,0.15)",
    borderColor: "rgba(245,158,11,0.6)",
  },
  pillOpen: {
    borderColor: "#F59E0B",
  },
  pillIcon: { fontSize: 13 },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    maxWidth: 88,
  },
  pillTextActive: {
    color: "#F59E0B",
  },
  pillCaret: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    marginTop: 1,
  },
  pillCaretActive: {
    color: "rgba(245,158,11,0.7)",
  },

  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0D1B2A",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingBottom: 36,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    maxHeight: "75%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },

  // Any row
  anyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  anyRowActive: {
    backgroundColor: "rgba(245,158,11,0.08)",
  },
  anyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
  },
  anyTextActive: {
    color: "#F59E0B",
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 24,
    marginBottom: 4,
  },

  // Group
  groupDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 24,
    marginVertical: 4,
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  groupText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.3,
  },
  groupTextActive: {
    color: "rgba(245,158,11,0.9)",
  },

  // Leaf
  leafRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingRight: 24,
  },
  leafRowActive: {
    backgroundColor: "rgba(245,158,11,0.07)",
  },
  leafIndent: { width: 24 },
  leafTextWrap: { flex: 1 },
  leafText: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
  },
  leafTextActive: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  leafSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    marginTop: 1,
  },
  leafSubActive: {
    color: "rgba(245,158,11,0.55)",
  },
});

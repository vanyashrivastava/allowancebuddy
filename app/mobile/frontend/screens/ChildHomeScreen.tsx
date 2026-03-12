import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BalanceCard from "../components/BalanceCard";
import colors from "../theme/colors";

// ── Hardcoded sample data (will come from backend later) ───────────

const todayGoals = ["Make bed (morning)", "Read 20 minutes", "Tidy toy shelf"];

const actionCards = [
  { title: "Chores Completed", value: "2 / 4" },
  { title: "Reading Time", value: "15 min" },
  { title: "Movement Game", value: "Ready" },
  { title: "Saving Money", value: "$3.00" },
];

const unlockedDogTricks = ["Tail Wag", "High Five"];

// ── Screen ─────────────────────────────────────────────────────────

export default function ChildHomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Allowance Buddy</Text>
      <Text style={styles.subtitle}>
        Hi Explorer. Let&apos;s earn today&apos;s stars.
      </Text>

      {/* Balance */}
      <BalanceCard label="Current Allowance Balance" amount="$12.50" />

      {/* Today's Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Goals</Text>
        {todayGoals.map((goal) => (
          <Text key={goal} style={styles.listItem}>
            • {goal}
          </Text>
        ))}
      </View>

      {/* Action grid */}
      <View style={styles.grid}>
        {actionCards.map((card) => (
          <Pressable key={card.title} style={styles.actionCard}>
            <Text style={styles.actionTitle}>{card.title}</Text>
            <Text style={styles.actionValue}>{card.value}</Text>
          </Pressable>
        ))}
      </View>

      {/* Dog Rewards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dog Rewards Unlocked</Text>
        <Text style={styles.mutedText}>{unlockedDogTricks.join(" • ")}</Text>
      </View>

      {/* Streak */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Streak</Text>
        <Text style={styles.mutedText}>5 days in a row</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: "#3C7A6A",
    fontSize: 14,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EEE8",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F4D3F",
    marginBottom: 8,
  },
  listItem: {
    color: "#335F53",
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5EEE8",
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F4D3F",
    marginBottom: 4,
  },
  actionValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  mutedText: {
    color: colors.textMedium,
  },
  progressTrack: {
    marginTop: 8,
    height: 10,
    backgroundColor: "#E5EEE8",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    width: "71%", // 5/7 days
    height: "100%",
    backgroundColor: "#4CAF84",
    borderRadius: 5,
  },
});

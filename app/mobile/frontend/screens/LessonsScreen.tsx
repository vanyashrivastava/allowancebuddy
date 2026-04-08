import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { Reward } from "../../backend/types";
import RewardCard from "../components/RewardCard";
import colors from "../theme/colors";

// ── Hardcoded sample data ──────────────────────────────────────────

const rewards: Reward[] = [
  { id: "1", name: "Dog Tail Wag", description: "Your buddy wags their tail!", cost: 2, unlocked: true },
  { id: "2", name: "New Dog Trick", description: "Teach your buddy a new trick", cost: 4, unlocked: false },
  { id: "3", name: "Extra Weekend Treat", description: "A special weekend surprise", cost: 5, unlocked: false },
  { id: "4", name: "Small Toy", description: "Pick a small toy reward", cost: 12, unlocked: false },
  { id: "5", name: "Bonus Allowance", description: "Extra $2 added to balance", cost: 8, unlocked: true },
];

// ── Screen ─────────────────────────────────────────────────────────

export default function LessonsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <Text style={styles.subtitle}>Spend allowance on fun unlocks.</Text>

      <FlatList<Reward>
        data={rewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <RewardCard reward={item} />}
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accentLight,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.accent,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    color: "#7C6A33",
  },
  listContent: {
    paddingBottom: 20,
  },
});

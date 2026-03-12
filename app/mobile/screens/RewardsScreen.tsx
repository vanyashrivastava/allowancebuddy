import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RewardItem } from "../types";

const rewards: RewardItem[] = [
  { id: "1", name: "Dog Tail Wag", cost: 2, unlocked: true },
  { id: "2", name: "New Dog Trick", cost: 4, unlocked: false },
  { id: "3", name: "Extra Weekend Treat", cost: 5, unlocked: false },
  { id: "4", name: "Small Toy", cost: 12, unlocked: false },
  { id: "5", name: "Bonus Allowance", cost: 8, unlocked: true },
];

export default function RewardsScreen() {
  const renderReward = ({ item }: { item: RewardItem }) => (
    <View style={[styles.card, item.unlocked ? styles.unlockedCard : styles.lockedCard]}>
      <View>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardCost}>Cost: ${item.cost}</Text>
      </View>
      <Text style={[styles.status, item.unlocked ? styles.unlockedText : styles.lockedText]}>
        {item.unlocked ? "Unlocked" : "Locked"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <Text style={styles.subtitle}>Spend allowance on fun unlocks.</Text>

      <FlatList<RewardItem>
        data={rewards}
        keyExtractor={(item: RewardItem) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderReward}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF6",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#5A4A1A",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    color: "#7C6A33",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unlockedCard: {
    backgroundColor: "#E6F7EE",
    borderColor: "#BFE7CF",
  },
  lockedCard: {
    backgroundColor: "#F5F3EA",
    borderColor: "#E3DDC5",
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3F3513",
  },
  rewardCost: {
    marginTop: 4,
    color: "#6D6032",
  },
  status: {
    fontWeight: "700",
  },
  unlockedText: {
    color: "#1F7A4E",
  },
  lockedText: {
    color: "#8A7E54",
  },
});

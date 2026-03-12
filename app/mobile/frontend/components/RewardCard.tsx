import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Reward } from "../../backend/types";
import colors from "../theme/colors";

type RewardCardProps = {
  reward: Reward;
};

/** A card showing a single reward with its cost and lock status. */
export default function RewardCard({ reward }: RewardCardProps) {
  const unlocked = reward.unlocked;

  return (
    <View style={[styles.card, unlocked ? styles.unlockedCard : styles.lockedCard]}>
      <View style={styles.info}>
        <Text style={styles.name}>{reward.name}</Text>
        {reward.description ? (
          <Text style={styles.description}>{reward.description}</Text>
        ) : null}
        <Text style={styles.cost}>Cost: ${reward.cost}</Text>
      </View>
      <Text style={[styles.status, unlocked ? styles.unlockedText : styles.lockedText]}>
        {unlocked ? "Unlocked" : "Locked"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: colors.accentBorder,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3F3513",
  },
  description: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMedium,
  },
  cost: {
    marginTop: 4,
    color: "#6D6032",
  },
  status: {
    fontWeight: "700",
  },
  unlockedText: {
    color: colors.success,
  },
  lockedText: {
    color: "#8A7E54",
  },
});

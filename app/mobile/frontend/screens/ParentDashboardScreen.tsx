import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BalanceCard from "../components/BalanceCard";
import colors from "../theme/colors";

// ── Hardcoded sample data ──────────────────────────────────────────

const activityLog = [
  "7:45 AM — Made bed — Pending",
  "4:20 PM — Reading session — Approved",
  "5:10 PM — Toy cleanup — Needs Review",
];

const configuredRewards = [
  "Dog tail wag animation — $2",
  "Extra weekend treat — $5",
  "Small toy — $12",
];

// ── Screen ─────────────────────────────────────────────────────────

export default function ParentDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Parent Dashboard</Text>

      {/* Balance summary */}
      <BalanceCard
        label="Child Balance Summary"
        amount="$12.50 available"
        subtitle="$3.00 moved to savings this week"
      />

      {/* Activity log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity Log</Text>
        {activityLog.map((log) => (
          <Text key={log} style={styles.listItem}>
            • {log}
          </Text>
        ))}
      </View>

      {/* Configured rewards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards Configured</Text>
        {configuredRewards.map((reward) => (
          <Text key={reward} style={styles.listItem}>
            • {reward}
          </Text>
        ))}
      </View>

      {/* Vision placeholders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Time / Phone Detection</Text>
        <Text style={styles.placeholder}>
          Placeholder: phone hunch detected 2 times today.
        </Text>
        <Text style={styles.sectionTitle}>Reading / Good Action</Text>
        <Text style={styles.placeholder}>
          Placeholder: reading posture detected for 18 minutes.
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.approveButton]}>
          <Text style={styles.buttonText}>Approve Chore</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.rewardButton]}>
          <Text style={styles.buttonText}>Approve Reward</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBg,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.secondary,
    marginBottom: 12,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#233446",
    marginBottom: 8,
  },
  listItem: {
    color: "#3C4A5A",
    marginBottom: 4,
  },
  placeholder: {
    color: "#51606F",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#34A06B",
  },
  rewardButton: {
    backgroundColor: "#2A7BDE",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});

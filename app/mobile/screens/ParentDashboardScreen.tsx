import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const activityLog = [
  "7:45 AM - Made bed - Pending",
  "4:20 PM - Reading session - Approved",
  "5:10 PM - Toy cleanup - Needs Review",
];

const configuredRewards = [
  "Dog tail wag animation - $2",
  "Extra weekend treat - $5",
  "Small toy - $12",
];

export default function ParentDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Dashboard</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Child Balance Summary</Text>
        <Text style={styles.balance}>$12.50 available</Text>
        <Text style={styles.helper}>$3.00 moved to savings this week</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity Log</Text>
        {activityLog.map((log) => (
          <Text key={log} style={styles.listItem}>
            • {log}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards Configured</Text>
        {configuredRewards.map((reward) => (
          <Text key={reward} style={styles.listItem}>
            • {reward}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Time / Phone Detection</Text>
        <Text style={styles.placeholder}>Placeholder: phone hunch detected 2 times today.</Text>
        <Text style={styles.sectionTitle}>Reading / Good Action</Text>
        <Text style={styles.placeholder}>Placeholder: reading posture detected for 18 minutes.</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.approveButton]}>
          <Text style={styles.buttonText}>Approve Chore</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.rewardButton]}>
          <Text style={styles.buttonText}>Approve Reward</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#243547",
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#EAF1F8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D7E5F2",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B4761",
  },
  balance: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: "#1D3245",
  },
  helper: {
    marginTop: 4,
    color: "#4C647D",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#67B99A",
  },
  rewardButton: {
    backgroundColor: "#4C8FD9",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

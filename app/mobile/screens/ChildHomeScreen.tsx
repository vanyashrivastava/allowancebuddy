import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const todayGoals = [
  "Make bed (morning)",
  "Read 20 minutes",
  "Tidy toy shelf",
];

const actionCards = [
  { title: "Chores Completed", value: "2 / 4" },
  { title: "Reading Time", value: "15 min" },
  { title: "Movement Game", value: "Ready" },
  { title: "Saving Money", value: "$3.00" },
];

const unlockedDogTricks = ["Tail Wag", "High Five"];

export default function ChildHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allowance Buddy</Text>
      <Text style={styles.subtitle}>Hi Explorer. Let&apos;s earn today&apos;s stars.</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Current Allowance Balance</Text>
        <Text style={styles.balanceValue}>$12.50</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today&apos;s Goals</Text>
        {todayGoals.map((goal) => (
          <Text key={goal} style={styles.listItem}>
            • {goal}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {actionCards.map((card) => (
          <Pressable key={card.title} style={styles.actionCard}>
            <Text style={styles.actionTitle}>{card.title}</Text>
            <Text style={styles.actionValue}>{card.value}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dog Rewards Unlocked</Text>
        <Text style={styles.mutedText}>{unlockedDogTricks.join(" • ")}</Text>
      </View>

      <View style={styles.progressWrap}>
        <Text style={styles.sectionTitle}>Weekly Streak</Text>
        <Text style={styles.mutedText}>5 days in a row</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FBF4",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#245B4B",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: "#3C7A6A",
    fontSize: 14,
  },
  balanceCard: {
    backgroundColor: "#D9F4E7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#BDE8D5",
  },
  cardLabel: {
    color: "#2D6B59",
    fontSize: 13,
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#17483A",
    marginTop: 6,
  },
  section: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFF4D8",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFE6A6",
  },
  actionTitle: {
    fontSize: 13,
    color: "#7A5B00",
    fontWeight: "700",
  },
  actionValue: {
    marginTop: 6,
    fontSize: 16,
    color: "#5E4300",
    fontWeight: "700",
  },
  mutedText: {
    color: "#4F6D63",
  },
  progressWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5EEE8",
  },
  progressTrack: {
    marginTop: 10,
    height: 10,
    backgroundColor: "#EAF2ED",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#58B78D",
  },
});

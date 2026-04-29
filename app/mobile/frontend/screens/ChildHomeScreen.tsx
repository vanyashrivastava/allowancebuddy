import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
} from "react-native";

const todayGoals = [
  { id: 1, label: "Make bed", emoji: "🛏️", done: true },
  { id: 2, label: "Read 20 minutes", emoji: "📖", done: true },
  { id: 3, label: "Tidy toy shelf", emoji: "🧸", done: false },
];

const unlockedDogTricks = [
  { trick: "Tail Wag", emoji: "🐾" },
  { trick: "High Five", emoji: "✋" },
];

const lockedDogTricks = [
  { trick: "Spin Around", emoji: "🌀" },
  { trick: "Backflip", emoji: "🤸" },
];

const streakDays = ["M", "T", "W", "T", "F", "S", "S"];
const completedDays = [0, 1, 2, 3, 4];

export default function ChildHomeScreen() {
  const [goals, setGoals] = useState(todayGoals);

  const toggleGoal = (id: number) =>
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );

  const doneCount = goals.filter((g) => g.done).length;
  const progressPct = Math.round((doneCount / goals.length) * 100);

  return (
    <ImageBackground
      source={require("../../assets/ChildBG.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hey Explorer! 👋</Text>
              <Text style={styles.title}>Let's have a great day!</Text>
            </View>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarEmoji}>🧒</Text>
            </View>
          </View>

          {/* ── Balance card ── */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceLeft}>
              <Text style={styles.balanceLabel}>My Balance</Text>
              <Text style={styles.balanceAmount}>$12.50</Text>
              <View style={styles.savingsPill}>
                <Text style={styles.savingsText}>🏦 $3.00 in savings</Text>
              </View>
            </View>
            <Text style={styles.balanceCoin}>🪙</Text>
          </View>

          {/* ── Quick stats ── */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statVal}>2/4</Text>
              <Text style={styles.statLbl}>Chores</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>📖</Text>
              <Text style={styles.statVal}>15m</Text>
              <Text style={styles.statLbl}>Reading</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statVal}>5</Text>
              <Text style={styles.statLbl}>Day streak</Text>
            </View>
          </View>

          {/* ── Today's Goals ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🎯 Today's Goals</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{progressPct}%</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
            </View>
            <View style={{ marginTop: 12 }}>
              {goals.map((goal) => (
                <Pressable
                  key={goal.id}
                  style={[styles.goalRow, goal.done && styles.goalRowDone]}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <View style={[styles.checkbox, goal.done && styles.checkboxDone]}>
                    {goal.done && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  <Text style={[styles.goalLabel, goal.done && styles.goalLabelDone]}>
                    {goal.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Weekly streak ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔥 Weekly Streak</Text>
            <View style={styles.streakRow}>
              {streakDays.map((day, i) => (
                <View key={i} style={styles.streakDayCol}>
                  <View style={[
                    styles.streakDot,
                    completedDays.includes(i) ? styles.streakDotDone : styles.streakDotEmpty,
                  ]}>
                    {completedDays.includes(i) && (
                      <Text style={styles.streakCheck}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.streakDay}>{day}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.streakCaption}>5 days in a row — keep it up! 🎉</Text>
          </View>

          {/* ── Dog rewards ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🐶 Dog Tricks Unlocked</Text>
            <View style={styles.tricksGrid}>
              {unlockedDogTricks.map((t) => (
                <View key={t.trick} style={styles.trickChip}>
                  <Text style={styles.trickEmoji}>{t.emoji}</Text>
                  <Text style={styles.trickLabel}>{t.trick}</Text>
                </View>
              ))}
              {lockedDogTricks.map((t) => (
                <View key={t.trick} style={[styles.trickChip, styles.trickLocked]}>
                  <Text style={styles.trickEmoji}>🔒</Text>
                  <Text style={[styles.trickLabel, styles.trickLabelLocked]}>{t.trick}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Movement game CTA ── */}
          <Pressable style={styles.movementCard}>
            <View>
              <Text style={styles.movementTitle}>🏃 Movement Game</Text>
              <Text style={styles.movementSub}>Tap to start today's challenge!</Text>
            </View>
            <View style={styles.movementBadge}>
              <Text style={styles.movementBadgeText}>Ready!</Text>
            </View>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 13,
    color: "#3A6B4A",
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1A3A2A",
    marginTop: 2,
    letterSpacing: -0.4,
  },
  avatarWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#A8D8B0",
    shadowColor: "#2D6A4F",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarEmoji: { fontSize: 28 },

  // Balance card
  balanceCard: {
    backgroundColor: "#2D6A4F",
    borderRadius: 28,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#1B4332",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  balanceLeft: { gap: 4 },
  balanceLabel: { fontSize: 13, color: "#95D5B2", fontWeight: "700" },
  balanceAmount: { fontSize: 40, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  savingsPill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  savingsText: { color: "#D8F3DC", fontSize: 12, fontWeight: "700" },
  balanceCoin: { fontSize: 60 },

  // Stats
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statChip: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,255,255,0.88)",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: { fontSize: 22 },
  statVal: { fontSize: 17, fontWeight: "900", color: "#1A3A2A" },
  statLbl: { fontSize: 10, color: "#7A9E7E", textAlign: "center", fontWeight: "600" },

  // Cards
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#2D6A4F",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#1A3A2A", letterSpacing: -0.2 },
  progressBadge: {
    backgroundColor: "#D8F3DC",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressBadgeText: { fontSize: 12, fontWeight: "900", color: "#2D6A4F" },

  // Progress bar
  progressTrack: {
    height: 9, backgroundColor: "#E8F5E9", borderRadius: 99, overflow: "hidden",
  },
  progressFill: {
    height: "100%", backgroundColor: "#40C074", borderRadius: 99,
  },

  // Goals
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginBottom: 4,
    gap: 10,
  },
  goalRowDone: { backgroundColor: "#F0FBF2" },
  checkbox: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2.5, borderColor: "#C8E6C9",
    justifyContent: "center", alignItems: "center",
  },
  checkboxDone: { backgroundColor: "#40C074", borderColor: "#40C074" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "900" },
  goalEmoji: { fontSize: 20 },
  goalLabel: { fontSize: 14, fontWeight: "700", color: "#2D4A35", flex: 1 },
  goalLabelDone: { color: "#A5C8A8", textDecorationLine: "line-through" },

  // Streak
  streakRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 14, marginBottom: 10,
  },
  streakDayCol: { alignItems: "center", gap: 6 },
  streakDot: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
  },
  streakDotDone: { backgroundColor: "#40C074" },
  streakDotEmpty: { backgroundColor: "#E8F5E9" },
  streakCheck: { color: "#fff", fontWeight: "900", fontSize: 14 },
  streakDay: { fontSize: 11, color: "#7A9E7E", fontWeight: "700" },
  streakCaption: { fontSize: 12, color: "#7A9E7E", textAlign: "center", fontWeight: "600" },

  // Dog tricks
  tricksGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  trickChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#F0FBF2",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9,
    borderWidth: 1.5, borderColor: "#B7E4C7",
  },
  trickLocked: { backgroundColor: "#F9FAF9", borderColor: "#E0EDE0" },
  trickEmoji: { fontSize: 18 },
  trickLabel: { fontSize: 13, fontWeight: "800", color: "#2D6A4F" },
  trickLabelLocked: { color: "#B0C4B1" },

  // Movement CTA
  movementCard: {
    backgroundColor: "#52B788",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#2D6A4F",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  movementTitle: { fontSize: 16, fontWeight: "900", color: "#fff" },
  movementSub: { fontSize: 12, color: "#D8F3DC", marginTop: 3, fontWeight: "600" },
  movementBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  movementBadgeText: { color: "#fff", fontWeight: "900", fontSize: 13 },
});

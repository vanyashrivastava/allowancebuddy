import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";

// ── Data ───────────────────────────────────────────────────────────

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
const completedDays = [0, 1, 2, 3, 4]; // Mon–Fri done

// ── Main Screen ────────────────────────────────────────────────────

export default function ChildHomeScreen() {
  const [goals, setGoals] = useState(todayGoals);

  const toggleGoal = (id: number) =>
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );

  const doneCount = goals.filter((g) => g.done).length;
  const progressPct = Math.round((doneCount / goals.length) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey Explorer! 👋</Text>
            <Text style={styles.title}>Let's earn today's stars ⭐</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>🧒</Text>
          </View>
        </View>

        {/* ── Balance hero card ── */}
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
          <View style={[styles.statChip, { backgroundColor: "#EEF2FF" }]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statVal}>2/4</Text>
            <Text style={styles.statLbl}>Chores</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#FFF7ED" }]}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statVal}>15m</Text>
            <Text style={styles.statLbl}>Reading</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#F0FDF4" }]}>
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

          {/* Progress bar */}
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
                <View
                  style={[
                    styles.streakDot,
                    completedDays.includes(i)
                      ? styles.streakDotDone
                      : styles.streakDotEmpty,
                  ]}
                >
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
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0FBF6" },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 14, color: "#3C7A6A", fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "800", color: "#1A3D34", marginTop: 2 },
  avatarWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#C8F0DF",
    justifyContent: "center", alignItems: "center",
  },
  avatarEmoji: { fontSize: 28 },

  // Balance card
  balanceCard: {
    backgroundColor: "#22A06B",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#22A06B",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  balanceLeft: { gap: 4 },
  balanceLabel: { fontSize: 13, color: "#A8EDD0", fontWeight: "600" },
  balanceAmount: { fontSize: 38, fontWeight: "900", color: "#fff" },
  savingsPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  savingsText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  balanceCoin: { fontSize: 56 },

  // Stats row
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statChip: {
    flex: 1, borderRadius: 16, padding: 12, alignItems: "center", gap: 2,
  },
  statEmoji: { fontSize: 20 },
  statVal: { fontSize: 17, fontWeight: "800", color: "#111827" },
  statLbl: { fontSize: 10, color: "#6B7280", textAlign: "center" },

  // Generic card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#1A3D34" },
  progressBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  progressBadgeText: { fontSize: 12, fontWeight: "800", color: "#065F46" },

  // Progress bar
  progressTrack: {
    height: 8, backgroundColor: "#E5EEE8", borderRadius: 4, overflow: "hidden",
  },
  progressFill: {
    height: "100%", backgroundColor: "#22A06B", borderRadius: 4,
  },

  // Goal rows
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
    gap: 10,
  },
  goalRowDone: { backgroundColor: "#F0FDF4" },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: "#D1D5DB",
    justifyContent: "center", alignItems: "center",
  },
  checkboxDone: { backgroundColor: "#22A06B", borderColor: "#22A06B" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  goalEmoji: { fontSize: 20 },
  goalLabel: { fontSize: 14, fontWeight: "600", color: "#374151", flex: 1 },
  goalLabelDone: { color: "#9CA3AF", textDecorationLine: "line-through" },

  // Streak
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 10,
  },
  streakDayCol: { alignItems: "center", gap: 6 },
  streakDot: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: "center", alignItems: "center",
  },
  streakDotDone: { backgroundColor: "#22A06B" },
  streakDotEmpty: { backgroundColor: "#E5EEE8" },
  streakCheck: { color: "#fff", fontWeight: "800", fontSize: 14 },
  streakDay: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
  streakCaption: { fontSize: 12, color: "#6B7280", textAlign: "center" },

  // Dog tricks
  tricksGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12,
  },
  trickChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#F0FDF4",
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: "#A7F3D0",
  },
  trickLocked: {
    backgroundColor: "#F9FAFB", borderColor: "#E5E7EB",
  },
  trickEmoji: { fontSize: 18 },
  trickLabel: { fontSize: 13, fontWeight: "700", color: "#065F46" },
  trickLabelLocked: { color: "#9CA3AF" },

  // Movement CTA
  movementCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  movementTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  movementSub: { fontSize: 12, color: "#C7D2FE", marginTop: 3 },
  movementBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  movementBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
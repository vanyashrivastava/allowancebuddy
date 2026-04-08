import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../theme/colors";

const todayGoals = [
  { label: "Make bed", amount: "+$1.00", done: true },
  { label: "Read a book", amount: "+$1.00", done: true },
  { label: "Tidy toy shelf", amount: "+$1.00", done: true },
];

const earned = "$4.00";
const spent = "$1.50";
const currentBalance = 12.5;
const goalAmount = 20;
const progressPercent = Math.round((currentBalance / goalAmount) * 100);

export default function ChildHomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.greeting}>Hey MAIA! 👋</Text>
            <Text style={styles.headerSub}>Let&apos;s do some tasks today.</Text>
          </View>

          <View style={styles.logoWrap}>
            <Image
              source={require("../logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Goal progress */}
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>Goal: Unlock New Trick</Text>
          <Text style={styles.goalTitle}>"SIT"</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>

          <Text style={styles.balanceText}>
            ${currentBalance.toFixed(2)} / ${goalAmount.toFixed(2)}
          </Text>
          <Text style={styles.helperText}>Keep going, you&apos;re close!</Text>
        </View>

        {/* Today's goals */}
        <View style={styles.sectionCardGreen}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleLight}>Today&apos;s Goals</Text>
            <Text style={styles.sectionEmoji}>🎯</Text>
          </View>

          {todayGoals.map((goal, index) => (
            <View
              key={goal.label}
              style={[
                styles.goalRow,
                index === todayGoals.length - 1 ? styles.goalRowLast : null,
              ]}
            >
              <View style={styles.checkBox}>
                <Text style={styles.checkMark}>{goal.done ? "✓" : ""}</Text>
              </View>

              <Text style={styles.goalRowLabel}>{goal.label}</Text>
              <Text style={styles.goalRowAmount}>{goal.amount}</Text>
            </View>
          ))}
        </View>

        {/* Rewards */}
        <View style={styles.rewardsCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleLight}>Rewards</Text>
            <Text style={styles.sectionEmoji}>🎁</Text>
          </View>

          <View style={styles.rewardGrid}>
            <View style={styles.rewardStat}>
              <Text style={styles.rewardIcon}>💰</Text>
              <Text style={styles.rewardValue}>{earned}</Text>
              <Text style={styles.rewardLabel}>Earned</Text>
            </View>

            <View style={[styles.rewardStat, styles.rewardStatLast]}>
              <Text style={styles.rewardIcon}>👛</Text>
              <Text style={[styles.rewardValue, styles.rewardValueSpent]}>{spent}</Text>
              <Text style={styles.rewardLabel}>Spent</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaText}>🎁 Go to Rewards</Text>
        </Pressable>

        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          <View style={styles.navItemActive}>
            <Text style={styles.navIconActive}>🏠</Text>
            <Text style={styles.navTextActive}>Home</Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🎁</Text>
            <Text style={styles.navText}>Rewards</Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Parent</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },

  // ── Header ──────────────────────────────────────────────
  headerCard: {
    backgroundColor: colors.secondary,       // blue #2F5AA8
    borderRadius: 28,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 120,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.white,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 15,
    color: "#FFF9DE",
    fontWeight: "600",
  },
  logoWrap: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: "#FFE6C9",             // warm peach logo background
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 78,
    height: 78,
  },

  // ── Goal progress ────────────────────────────────────────
  goalCard: {
    backgroundColor: colors.accentLight,    // #FFF6E5
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.accentBorder,       // #F2D39B
    marginBottom: 14,
  },
  goalLabel: {
    textAlign: "center",
    color: "#2E5B16",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  goalTitle: {
    textAlign: "center",
    color: colors.primary,                  // #4EA93A green
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 14,
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#FFF7E7",
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.secondary,     // blue progress bar to match screenshot
  },
  balanceText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#3E3E3E",
    marginBottom: 4,
  },
  helperText: {
    textAlign: "center",
    fontSize: 13,
    color: colors.textMedium,
    fontWeight: "600",
  },

  // ── Today's Goals ────────────────────────────────────────
  sectionCardGreen: {
    backgroundColor: colors.primary,        // #4EA93A green
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sectionTitleLight: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  goalRow: {
    backgroundColor: "#F9FFF4",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  goalRowLast: {
    marginBottom: 0,
  },
  checkBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#2F7D32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkMark: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginTop: -1,
  },
  goalRowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#22412A",
  },
  goalRowAmount: {
    fontSize: 16,
    fontWeight: "900",
    color: "#236B2A",
  },

  // ── Rewards ──────────────────────────────────────────────
  rewardsCard: {
    backgroundColor: colors.highlight,      // #F2797C coral/red
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  rewardGrid: {
    flexDirection: "row",
    gap: 10,
  },
  rewardStat: {
    flex: 1,
    backgroundColor: "#FFF9F4",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  rewardStatLast: {
    // no extra margin needed with gap
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2D5A2B",
  },
  rewardValueSpent: {
    color: "#C0392B",                       // red tint for spent amount
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMedium,
    marginTop: 2,
  },

  // ── CTA button ───────────────────────────────────────────
  ctaButton: {
    backgroundColor: colors.accent,         // #FABF58 gold
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ctaText: {
    color: "#5A4200",
    fontSize: 17,
    fontWeight: "900",
  },

  // ── Bottom nav ───────────────────────────────────────────
  bottomNav: {
    backgroundColor: colors.tabBarBg,       // #FFF8E8
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,    // #F6EFA5
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    opacity: 0.7,
  },
  navItemActive: {
    alignItems: "center",
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  navIconActive: {
    fontSize: 22,
    marginBottom: 2,
  },
  navText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMedium,
  },
  navTextActive: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,                  // #4EA93A green for active tab
  },
});
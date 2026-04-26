import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// ── Data ───────────────────────────────────────────────────────────

const activityLog = [
  { time: "7:45 AM", action: "Made bed", status: "Pending" },
  { time: "4:20 PM", action: "Reading session", status: "Approved" },
  { time: "5:10 PM", action: "Toy cleanup", status: "Needs Review" },
];

const configuredRewards = [
  { label: "Dog tail wag animation", amount: "$2", icon: "🐶" },
  { label: "Extra weekend treat", amount: "$5", icon: "🍪" },
  { label: "Small toy", amount: "$12", icon: "🧸" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Approved: { bg: "#D1FAE5", text: "#065F46" },
  Pending: { bg: "#FEF3C7", text: "#92400E" },
  "Needs Review": { bg: "#FFE4E6", text: "#9F1239" },
};

type AuthMode = "login" | "signup";
type Screen = "auth" | "dashboard";

// ── Auth Screen ────────────────────────────────────────────────────

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isLogin = mode === "login";

  return (
    <SafeAreaView style={auth.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={auth.flex}
      >
        <View style={auth.container}>
          <View style={auth.brandBlock}>
            <View style={auth.logoCircle}>
              <Text style={auth.logoEmoji}>⭐</Text>
            </View>
            <Text style={auth.appName}>KidRewards</Text>
            <Text style={auth.tagline}>Helping families build great habits</Text>
          </View>

          <View style={auth.card}>
            <View style={auth.tabs}>
              <Pressable
                style={[auth.tab, isLogin && auth.tabActive]}
                onPress={() => setMode("login")}
              >
                <Text style={[auth.tabText, isLogin && auth.tabTextActive]}>Log In</Text>
              </Pressable>
              <Pressable
                style={[auth.tab, !isLogin && auth.tabActive]}
                onPress={() => setMode("signup")}
              >
                <Text style={[auth.tabText, !isLogin && auth.tabTextActive]}>Sign Up</Text>
              </Pressable>
            </View>

            {!isLogin && (
              <View style={auth.fieldBlock}>
                <Text style={auth.label}>Full Name</Text>
                <TextInput
                  style={[auth.input, focusedField === "name" && auth.inputFocused]}
                  placeholder="Jane Smith"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={auth.fieldBlock}>
              <Text style={auth.label}>Email</Text>
              <TextInput
                style={[auth.input, focusedField === "email" && auth.inputFocused]}
                placeholder="parent@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={auth.fieldBlock}>
              <Text style={auth.label}>Password</Text>
              <TextInput
                style={[auth.input, focusedField === "password" && auth.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
              />
            </View>

            {isLogin && (
              <Pressable style={auth.forgot}>
                <Text style={auth.forgotText}>Forgot password?</Text>
              </Pressable>
            )}

            <Pressable style={auth.ctaButton} onPress={onLogin}>
              <Text style={auth.ctaText}>{isLogin ? "Log In" : "Create Account"}</Text>
            </Pressable>

            <View style={auth.dividerRow}>
              <View style={auth.divider} />
              <Text style={auth.dividerText}>or continue with</Text>
              <View style={auth.divider} />
            </View>

            <View style={auth.socialRow}>
              <Pressable style={auth.socialButton} onPress={onLogin}>
                <Text style={auth.socialText}>🍎  Apple</Text>
              </Pressable>
              <Pressable style={auth.socialButton} onPress={onLogin}>
                <Text style={auth.socialText}>🌐  Google</Text>
              </Pressable>
            </View>
          </View>

          <Text style={auth.footer}>
            {isLogin ? "New here? " : "Already have an account? "}
            <Text
              style={auth.footerLink}
              onPress={() => setMode(isLogin ? "signup" : "login")}
            >
              {isLogin ? "Create an account" : "Log in"}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Dashboard Screen ───────────────────────────────────────────────

function ParentDashboardScreen({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"activity" | "rewards">("activity");

  return (
    <SafeAreaView style={dash.safe}>
      <ScrollView
        style={dash.container}
        contentContainerStyle={dash.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={dash.header}>
          <View>
            <Text style={dash.greeting}>Good afternoon 👋</Text>
            <Text style={dash.title}>Parent Dashboard</Text>
          </View>
          <Pressable style={dash.avatar} onPress={onLogout}>
            <Text style={dash.avatarText}>P</Text>
          </Pressable>
        </View>

        <View style={dash.statsRow}>
          <View style={[dash.statCard, { backgroundColor: "#EEF2FF" }]}>
            <Text style={dash.statEmoji}>💰</Text>
            <Text style={dash.statValue}>$12.50</Text>
            <Text style={dash.statLabel}>Available</Text>
          </View>
          <View style={[dash.statCard, { backgroundColor: "#F0FDF4" }]}>
            <Text style={dash.statEmoji}>🏦</Text>
            <Text style={dash.statValue}>$3.00</Text>
            <Text style={dash.statLabel}>Saved this week</Text>
          </View>
          <View style={[dash.statCard, { backgroundColor: "#FFF7ED" }]}>
            <Text style={dash.statEmoji}>✅</Text>
            <Text style={dash.statValue}>5</Text>
            <Text style={dash.statLabel}>Chores done</Text>
          </View>
        </View>

        <View style={dash.insightCard}>
          <Text style={dash.insightTitle}>📡 Today's Insights</Text>
          <View style={dash.insightRow}>
            <View style={dash.insightItem}>
              <Text style={dash.insightIcon}>📱</Text>
              <Text style={dash.insightStat}>2x</Text>
              <Text style={dash.insightDesc}>Phone hunching detected</Text>
            </View>
            <View style={dash.insightDivider} />
            <View style={dash.insightItem}>
              <Text style={dash.insightIcon}>📖</Text>
              <Text style={dash.insightStat}>18m</Text>
              <Text style={dash.insightDesc}>Reading posture held</Text>
            </View>
          </View>
        </View>

        <View style={dash.tabs}>
          <Pressable
            style={[dash.tab, activeTab === "activity" && dash.tabActive]}
            onPress={() => setActiveTab("activity")}
          >
            <Text style={[dash.tabText, activeTab === "activity" && dash.tabTextActive]}>
              Activity Log
            </Text>
          </Pressable>
          <Pressable
            style={[dash.tab, activeTab === "rewards" && dash.tabActive]}
            onPress={() => setActiveTab("rewards")}
          >
            <Text style={[dash.tabText, activeTab === "rewards" && dash.tabTextActive]}>
              Rewards
            </Text>
          </Pressable>
        </View>

        {activeTab === "activity" && (
          <View style={dash.section}>
            {activityLog.map((log, i) => {
              const badge = statusColors[log.status] ?? { bg: "#F3F4F6", text: "#374151" };
              return (
                <View
                  key={i}
                  style={[dash.logRow, i < activityLog.length - 1 && dash.logRowBorder]}
                >
                  <View style={dash.logLeft}>
                    <Text style={dash.logTime}>{log.time}</Text>
                    <Text style={dash.logAction}>{log.action}</Text>
                  </View>
                  <View style={[dash.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[dash.badgeText, { color: badge.text }]}>{log.status}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === "rewards" && (
          <View style={dash.section}>
            {configuredRewards.map((r, i) => (
              <View
                key={i}
                style={[dash.logRow, i < configuredRewards.length - 1 && dash.logRowBorder]}
              >
                <Text style={dash.rewardIcon}>{r.icon}</Text>
                <Text style={dash.rewardLabel}>{r.label}</Text>
                <Text style={dash.rewardAmount}>{r.amount}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={dash.buttonRow}>
          <Pressable style={[dash.button, dash.approveButton]}>
            <Text style={dash.buttonEmoji}>✅</Text>
            <Text style={dash.buttonText}>Approve Chore</Text>
          </Pressable>
          <Pressable style={[dash.button, dash.rewardButton]}>
            <Text style={dash.buttonEmoji}>🎁</Text>
            <Text style={dash.buttonText}>Approve Reward</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Root ───────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("auth");

  return screen === "auth" ? (
    <AuthScreen onLogin={() => setScreen("dashboard")} />
  ) : (
    <ParentDashboardScreen onLogout={() => setScreen("auth")} />
  );
}

// ── Auth Styles ────────────────────────────────────────────────────

const auth = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FB" },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  brandBlock: { alignItems: "center", marginBottom: 28 },
  logoCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: "#4F46E5",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
    shadowColor: "#4F46E5", shadowOpacity: 0.35, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  logoEmoji: { fontSize: 32 },
  appName: { fontSize: 28, fontWeight: "800", color: "#111827" },
  tagline: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  card: {
    backgroundColor: "#fff", borderRadius: 24, padding: 24,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  tabs: {
    flexDirection: "row", backgroundColor: "#F3F4F6",
    borderRadius: 12, padding: 3, marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#111827" },
  fieldBlock: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "700", color: "#374151", marginBottom: 6, letterSpacing: 0.3 },
  input: {
    backgroundColor: "#F9FAFB", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: "#111827", borderWidth: 1.5, borderColor: "#E5E7EB",
  },
  inputFocused: { borderColor: "#4F46E5", backgroundColor: "#fff" },
  forgot: { alignSelf: "flex-end", marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: "#4F46E5", fontWeight: "600" },
  ctaButton: {
    backgroundColor: "#4F46E5", borderRadius: 14,
    paddingVertical: 15, alignItems: "center", marginTop: 4,
    shadowColor: "#4F46E5", shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18, gap: 10 },
  divider: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  socialRow: { flexDirection: "row", gap: 10 },
  socialButton: {
    flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center",
    borderWidth: 1.5, borderColor: "#E5E7EB", backgroundColor: "#FAFAFA",
  },
  socialText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  footer: { textAlign: "center", marginTop: 20, color: "#6B7280", fontSize: 13 },
  footerLink: { color: "#4F46E5", fontWeight: "700" },
});

// ── Dashboard Styles ───────────────────────────────────────────────

const dash = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FB" },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  title: { fontSize: 26, fontWeight: "800", color: "#111827", marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#4F46E5", justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: "center" },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 10, color: "#6B7280", textAlign: "center", marginTop: 2 },
  insightCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  insightTitle: { fontWeight: "700", fontSize: 14, color: "#111827", marginBottom: 12 },
  insightRow: { flexDirection: "row", alignItems: "center" },
  insightItem: { flex: 1, alignItems: "center" },
  insightIcon: { fontSize: 24, marginBottom: 4 },
  insightStat: { fontSize: 20, fontWeight: "800", color: "#4F46E5" },
  insightDesc: { fontSize: 11, color: "#6B7280", textAlign: "center", marginTop: 2 },
  insightDivider: { width: 1, height: 48, backgroundColor: "#E5E7EB" },
  tabs: {
    flexDirection: "row", backgroundColor: "#E5E7EB",
    borderRadius: 12, padding: 3, marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#111827" },
  section: {
    backgroundColor: "#fff", borderRadius: 16, marginBottom: 16, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  logRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  logRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  logLeft: { flex: 1 },
  logTime: { fontSize: 11, color: "#9CA3AF", marginBottom: 2 },
  logAction: { fontSize: 14, fontWeight: "600", color: "#111827" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  rewardIcon: { fontSize: 22, marginRight: 12 },
  rewardLabel: { flex: 1, fontSize: 14, fontWeight: "500", color: "#374151" },
  rewardAmount: { fontSize: 15, fontWeight: "800", color: "#4F46E5" },
  buttonRow: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1, borderRadius: 14, paddingVertical: 14,
    alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
  },
  approveButton: { backgroundColor: "#059669" },
  rewardButton: { backgroundColor: "#4F46E5" },
  buttonEmoji: { fontSize: 16 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
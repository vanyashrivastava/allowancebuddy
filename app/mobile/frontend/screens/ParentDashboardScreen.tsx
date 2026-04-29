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
  ImageBackground,
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
  Approved:      { bg: "#D1FAE5", text: "#065F46" },
  Pending:       { bg: "#FEF3C7", text: "#92400E" },
  "Needs Review":{ bg: "#FFE4E6", text: "#9F1239" },
};

type AuthMode = "login" | "signup";
type Screen   = "auth" | "dashboard";

// ── Auth Screen ────────────────────────────────────────────────────

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode]               = useState<AuthMode>("login");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [name, setName]               = useState("");
  const [focusedField, setFocused]    = useState<string | null>(null);

  const isLogin = mode === "login";

  return (
    <ImageBackground
      source={require("../../assets/ParentsBG.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={auth.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={auth.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Brand */}
            <View style={auth.brandBlock}>
              <View style={auth.logoCircle}>
                <Text style={auth.logoEmoji}>🐾</Text>
              </View>
              <Text style={auth.appName}>KidRewards</Text>
              <Text style={auth.tagline}>Helping families build great habits</Text>
            </View>

            {/* Card */}
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
                    placeholderTextColor="#A0916F"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={auth.fieldBlock}>
                <Text style={auth.label}>Email</Text>
                <TextInput
                  style={[auth.input, focusedField === "email" && auth.inputFocused]}
                  placeholder="parent@example.com"
                  placeholderTextColor="#A0916F"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={auth.fieldBlock}>
                <Text style={auth.label}>Password</Text>
                <TextInput
                  style={[auth.input, focusedField === "password" && auth.inputFocused]}
                  placeholder="••••••••"
                  placeholderTextColor="#A0916F"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────

function ParentDashboardScreen({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"activity" | "rewards">("activity");

  return (
    <ImageBackground
      source={require("../../assets/ParentsBG.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={dash.safe}>
        <ScrollView
          contentContainerStyle={dash.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={dash.header}>
            <View>
              <Text style={dash.greeting}>Welcome back! 👋</Text>
              <Text style={dash.title}>Parent Dashboard</Text>
            </View>
            <Pressable style={dash.avatar} onPress={onLogout}>
              <Text style={dash.avatarEmoji}>👨‍👩‍👧</Text>
            </Pressable>
          </View>

          {/* Stats row */}
          <View style={dash.statsRow}>
            <View style={dash.statCard}>
              <Text style={dash.statEmoji}>✅</Text>
              <Text style={dash.statValue}>2/4</Text>
              <Text style={dash.statLabel}>Tasks Done</Text>
            </View>
            <View style={dash.statCard}>
              <Text style={dash.statEmoji}>📖</Text>
              <Text style={dash.statValue}>15m</Text>
              <Text style={dash.statLabel}>Reading</Text>
            </View>
            <View style={dash.statCard}>
              <Text style={dash.statEmoji}>🔥</Text>
              <Text style={dash.statValue}>5</Text>
              <Text style={dash.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* This Week */}
          <View style={dash.card}>
            <View style={dash.cardHeader}>
              <Text style={dash.cardTitle}>📅 This Week</Text>
              <Pressable>
                <Text style={dash.viewAll}>View all</Text>
              </Pressable>
            </View>
            <View style={dash.weekRow}>
              <Text style={dash.weekLabel}>✅  Chores completion</Text>
              <Text style={dash.weekValue}>68%</Text>
            </View>
            <View style={dash.weekDivider} />
            <View style={dash.weekRow}>
              <Text style={dash.weekLabel}>📖  Reading time</Text>
              <Text style={dash.weekValue}>3h 10m</Text>
            </View>
            <View style={dash.weekDivider} />
            <View style={dash.weekRow}>
              <Text style={dash.weekLabel}>🏦  Savings added</Text>
              <Text style={[dash.weekValue, { color: "#2D6A4F" }]}>$3.00</Text>
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={dash.card}>
            <View style={dash.cardHeader}>
              <Text style={dash.cardTitle}>🏆 Recent Achievements</Text>
            </View>
            <View style={dash.achievementRow}>
              <View style={dash.trophyCircle}>
                <Text style={{ fontSize: 24 }}>🏆</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dash.achievementTitle}>Great Streak!</Text>
                <Text style={dash.achievementSub}>5 days in a row</Text>
              </View>
              <Text style={dash.chevron}>›</Text>
            </View>
          </View>

          {/* Tabs */}
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

          {/* Tab content */}
          {activeTab === "activity" && (
            <View style={dash.card}>
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
            <View style={dash.card}>
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

          {/* Action buttons */}
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
    </ImageBackground>
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
  safe: { flex: 1, backgroundColor: "transparent" },
  container: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },

  brandBlock: { alignItems: "center", marginBottom: 28 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#8B5E3C",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
    shadowColor: "#5C3D1E", shadowOpacity: 0.35, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  logoEmoji: { fontSize: 34 },
  appName: { fontSize: 28, fontWeight: "900", color: "#3B2A1A", letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: "#7A6A55", marginTop: 4, fontWeight: "600" },

  card: {
    backgroundColor: "rgba(255,252,245,0.93)",
    borderRadius: 28, padding: 24,
    shadowColor: "#5C3D1E", shadowOpacity: 0.12, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  tabs: {
    flexDirection: "row", backgroundColor: "#EDE8DF",
    borderRadius: 14, padding: 3, marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#A0916F" },
  tabTextActive: { color: "#3B2A1A", fontWeight: "800" },

  fieldBlock: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "800", color: "#5C4A30", marginBottom: 6, letterSpacing: 0.4 },
  input: {
    backgroundColor: "#FAF7F2", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: "#3B2A1A",
    borderWidth: 1.5, borderColor: "#DDD5C5",
  },
  inputFocused: { borderColor: "#8B5E3C", backgroundColor: "#fff" },

  forgot: { alignSelf: "flex-end", marginBottom: 18, marginTop: -4 },
  forgotText: { fontSize: 13, color: "#8B5E3C", fontWeight: "700" },

  ctaButton: {
    backgroundColor: "#8B5E3C", borderRadius: 16,
    paddingVertical: 16, alignItems: "center", marginTop: 4,
    shadowColor: "#5C3D1E", shadowOpacity: 0.3, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  ctaText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18, gap: 10 },
  divider: { flex: 1, height: 1, backgroundColor: "#DDD5C5" },
  dividerText: { fontSize: 12, color: "#A0916F", fontWeight: "500" },

  socialRow: { flexDirection: "row", gap: 10 },
  socialButton: {
    flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center",
    borderWidth: 1.5, borderColor: "#DDD5C5", backgroundColor: "#FAF7F2",
  },
  socialText: { fontSize: 14, fontWeight: "700", color: "#5C4A30" },

  footer: { textAlign: "center", marginTop: 20, color: "#7A6A55", fontSize: 13, fontWeight: "500" },
  footerLink: { color: "#8B5E3C", fontWeight: "800" },
});

// ── Dashboard Styles ───────────────────────────────────────────────

const dash = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 20, paddingBottom: 48 },

  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 18,
  },
  greeting: { fontSize: 13, color: "#7A6A55", fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "900", color: "#3B2A1A", marginTop: 2, letterSpacing: -0.4 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,252,245,0.9)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#DDD5C5",
    shadowColor: "#5C3D1E", shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  avatarEmoji: { fontSize: 26 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, borderRadius: 18, padding: 12, alignItems: "center", gap: 3,
    backgroundColor: "rgba(255,252,245,0.90)",
    shadowColor: "#5C3D1E", shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  statEmoji: { fontSize: 22 },
  statValue: { fontSize: 17, fontWeight: "900", color: "#3B2A1A" },
  statLabel: { fontSize: 10, color: "#A0916F", textAlign: "center", fontWeight: "600" },

  card: {
    backgroundColor: "rgba(255,252,245,0.92)",
    borderRadius: 22, padding: 18, marginBottom: 14,
    shadowColor: "#5C3D1E", shadowOpacity: 0.08, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#3B2A1A", letterSpacing: -0.2 },
  viewAll: { fontSize: 13, color: "#8B5E3C", fontWeight: "700" },

  weekRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  weekLabel: { fontSize: 14, color: "#5C4A30", fontWeight: "600" },
  weekValue: { fontSize: 14, fontWeight: "800", color: "#8B5E3C" },
  weekDivider: { height: 1, backgroundColor: "#EDE8DF" },

  achievementRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  trophyCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#FEF3C7",
    justifyContent: "center", alignItems: "center",
  },
  achievementTitle: { fontSize: 15, fontWeight: "800", color: "#3B2A1A" },
  achievementSub: { fontSize: 12, color: "#A0916F", marginTop: 2, fontWeight: "600" },
  chevron: { fontSize: 22, color: "#C4B49A", fontWeight: "300" },

  tabs: {
    flexDirection: "row", backgroundColor: "rgba(237,232,223,0.9)",
    borderRadius: 14, padding: 3, marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 12, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 13, fontWeight: "700", color: "#A0916F" },
  tabTextActive: { color: "#3B2A1A", fontWeight: "900" },

  logRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  logRowBorder: { borderBottomWidth: 1, borderBottomColor: "#EDE8DF" },
  logLeft: { flex: 1 },
  logTime: { fontSize: 11, color: "#A0916F", marginBottom: 2, fontWeight: "600" },
  logAction: { fontSize: 14, fontWeight: "700", color: "#3B2A1A" },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontSize: 11, fontWeight: "800" },

  rewardIcon: { fontSize: 22, marginRight: 12 },
  rewardLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#5C4A30" },
  rewardAmount: { fontSize: 15, fontWeight: "900", color: "#8B5E3C" },

  buttonRow: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1, borderRadius: 16, paddingVertical: 15,
    alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 4,
  },
  approveButton: {
    backgroundColor: "#2D6A4F",
    shadowColor: "#1B4332",
  },
  rewardButton: {
    backgroundColor: "#8B5E3C",
    shadowColor: "#5C3D1E",
  },
  buttonEmoji: { fontSize: 16 },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 14 },
});

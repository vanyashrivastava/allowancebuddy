import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TextInput,
} from "react-native";

type Screen = "auth" | "dashboard";

// ─────────────────────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────────────────────

function TeacherAuthScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      source={require("../../assets/TeachersBG.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.authContainer}>
          {/* Header */}
          <View style={styles.brand}>
            <Text style={styles.logo}>🎓</Text>
            <Text style={styles.title}>Teacher Hub</Text>
            <Text style={styles.subtitle}>Empower. Teach. Inspire.</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="teacher@example.com"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.button} onPress={onLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

function TeacherDashboardScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <ImageBackground
      source={require("../../assets/TeachersBG.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>🎓 Teacher Hub</Text>
              <Text style={styles.headerSubtitle}>
                Empower. Teach. Inspire.
              </Text>
            </View>
            <Pressable style={styles.avatar} onPress={onLogout}>
              <Text style={{ fontSize: 22 }}>👩‍🏫</Text>
            </Pressable>
          </View>

          {/* Class Overview */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Class Overview</Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statEmoji}>👨‍🎓</Text>
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statEmoji}>📘</Text>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Lessons Done</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statEmoji}>📈</Text>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Avg Progress</Text>
              </View>
            </View>
          </View>

          {/* Activity */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>

            <View style={styles.row}>
              <Text>🏫 Lesson completed</Text>
              <Text style={styles.muted}>2h ago</Text>
            </View>

            <View style={styles.row}>
              <Text>⭐ Achievement unlocked</Text>
              <Text style={styles.muted}>5h ago</Text>
            </View>

            <View style={styles.row}>
              <Text>📝 Quiz submitted</Text>
              <Text style={styles.muted}>1d ago</Text>
            </View>
          </View>

          {/* Assignments */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Assignments</Text>

            <View style={styles.row}>
              <Text>📘 Lesson 3 Quiz</Text>
              <Text style={styles.muted}>Due in 2 days</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────

export default function TeacherScreen() {
  const [screen, setScreen] = useState<Screen>("auth");

  return screen === "auth" ? (
    <TeacherAuthScreen onLogin={() => setScreen("dashboard")} />
  ) : (
    <TeacherDashboardScreen onLogout={() => setScreen("auth")} />
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },

  authContainer: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },

  brand: { alignItems: "center", marginBottom: 40 },
  logo: { fontSize: 48 },
  title: { fontSize: 28, fontWeight: "900", color: "#1D3557" },
  subtitle: { color: "#6B7280", marginTop: 6 },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  label: { fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  button: {
    backgroundColor: "#3A86FF",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },

  container: { padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerTitle: { fontSize: 24, fontWeight: "900", color: "#1D3557" },
  headerSubtitle: { color: "#6B7280" },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },

  stat: { alignItems: "center" },
  statEmoji: { fontSize: 22 },
  statValue: { fontWeight: "900", fontSize: 16 },
  statLabel: { fontSize: 11, color: "#6B7280" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  muted: { color: "#9CA3AF" },
});
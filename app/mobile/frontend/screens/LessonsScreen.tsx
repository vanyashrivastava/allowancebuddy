import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import colors from "../theme/colors";

const lessonCards = [
  { title: "Saving", desc: "Keep some treats for later." },
  { title: "Spending", desc: "Use treats now for fun things." },
  { title: "Investing", desc: "Let treats grow over time." },
];

export default function LessonsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lessons 📚</Text>
      <Text style={styles.subtitle}>Learn money with Paula Paw 🐶</Text>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Paula Paw says:</Text>
        <Text style={styles.heroText}>
          “Saving helps future you. Investing can help your money grow!”
        </Text>
      </View>

      {lessonCards.map((lesson) => (
        <View key={lesson.title} style={styles.card}>
          <Text style={styles.cardTitle}>{lesson.title}</Text>
          <Text style={styles.cardText}>{lesson.desc}</Text>
        </View>
      ))}

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Start Lesson</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#3C7A6A",
    fontSize: 14,
  },
  hero: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5EEE8",
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F4D3F",
    marginBottom: 6,
  },
  heroText: {
    fontSize: 15,
    color: "#335F53",
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5EEE8",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F4D3F",
    marginBottom: 4,
  },
  cardText: {
    color: colors.textMedium,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
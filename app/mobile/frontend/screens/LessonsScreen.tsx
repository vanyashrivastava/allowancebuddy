import React, { useState, useRef } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../theme/colors";

// ── Types ──────────────────────────────────────────────────────────

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type FlipCardData = {
  id: string;
  front: string;
  back: string;
  emoji: string;
};

// ── Lesson Data ────────────────────────────────────────────────────

const FLIP_CARDS: FlipCardData[] = [
  {
    id: "1",
    emoji: "💳",
    front: "What is a Debit Card?",
    back: "A debit card spends money you ALREADY have in your bank account. When you buy something, the money comes out right away!",
  },
  {
    id: "2",
    emoji: "🏦",
    front: "What is a Credit Card?",
    back: "A credit card lets you borrow money from a bank to buy things now and pay it back later — sometimes with extra charges called interest.",
  },
  {
    id: "3",
    emoji: "⚠️",
    front: "What is Interest?",
    back: "Interest is the extra money you owe when you borrow money and don't pay it back quickly. Like a fee for borrowing!",
  },
  {
    id: "4",
    emoji: "⭐",
    front: "What is a Credit Score?",
    back: "A credit score is like a grade for how well you pay back borrowed money. A high score means banks trust you more!",
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "You buy a $5 snack with your debit card. What happens?",
    options: [
      "The bank lends you $5",
      "$5 is taken from your bank account right away",
      "You pay $5 later this month",
      "Nothing happens yet",
    ],
    correctIndex: 1,
    explanation:
      "Debit cards pull money directly from your account immediately — no borrowing involved!",
  },
  {
    id: "q2",
    question: "Which card could lead to owing MORE money than you spent?",
    options: ["Debit card", "Library card", "Credit card", "Gift card"],
    correctIndex: 2,
    explanation:
      "Credit cards charge interest if you don't pay the full balance on time, so you could owe more than you originally spent.",
  },
  {
    id: "q3",
    question: "Mia has $20 in her bank account. She uses her debit card to buy a $25 game. What happens?",
    options: [
      "She gets the game and pays later",
      "The bank covers the extra $5 for free",
      "The transaction is declined — not enough money",
      "She earns reward points",
    ],
    correctIndex: 2,
    explanation:
      "With a debit card, you can only spend what's in your account. No money = no purchase!",
  },
  {
    id: "q4",
    question: "Which statement about credit cards is TRUE?",
    options: [
      "They are always free to use",
      "They give you free money from the bank",
      "They let you borrow money you must repay",
      "They only work in stores, not online",
    ],
    correctIndex: 2,
    explanation:
      "Credit cards are loans — the bank pays for now, and you pay the bank back (sometimes with interest).",
  },
  {
    id: "q5",
    question: "What is ONE benefit of using a debit card?",
    options: [
      "You can spend more than you have",
      "It builds your credit score automatically",
      "You only spend money you already have",
      "You earn interest on purchases",
    ],
    correctIndex: 2,
    explanation:
      "Debit cards help you stay within budget since you can't spend money you don't have!",
  },
];

// ── Flip Card Component ────────────────────────────────────────────

function FlipCard({ card }: { card: FlipCardData }) {
  const [flipped, setFlipped] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const flip = () => {
    Animated.spring(anim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      useNativeDriver: true,
    }).start(() => setFlipped((f) => !f));
  };

  const frontRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.flipWrapper}>
      {/* Front */}
      <Animated.View
        style={[
          styles.flipCard,
          styles.flipFront,
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={styles.flipEmoji}>{card.emoji}</Text>
        <Text style={styles.flipFrontText}>{card.front}</Text>
        <Text style={styles.flipHint}>Tap to reveal</Text>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[
          styles.flipCard,
          styles.flipBack,
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <Text style={styles.flipEmoji}>{card.emoji}</Text>
        <Text style={styles.flipBackText}>{card.back}</Text>
        <Text style={styles.flipHint}>Tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Quiz Component ─────────────────────────────────────────────────

function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentQ];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const msg =
      pct === 100 ? "Perfect score! 🏆" : pct >= 60 ? "Great job! 🌟" : "Keep practicing! 💪";
    return (
      <View style={styles.finishedBox}>
        <Text style={styles.finishedEmoji}>🎉</Text>
        <Text style={styles.finishedTitle}>{msg}</Text>
        <Text style={styles.finishedScore}>
          You got {score} out of {QUIZ_QUESTIONS.length} correct ({pct}%)
        </Text>
        <TouchableOpacity style={styles.nextBtn} onPress={handleRestart}>
          <Text style={styles.nextBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.quizBox}>
      {/* Progress */}
      <View style={styles.progressRow}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < currentQ && styles.progressDotDone,
              i === currentQ && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.quizCounter}>
        Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
      </Text>
      <Text style={styles.quizQuestion}>{q.question}</Text>

      {q.options.map((opt, idx) => {
        let optStyle = styles.optionBtn;
        let optTextStyle = styles.optionText;

        if (showResult) {
          if (idx === q.correctIndex) {
            optStyle = { ...styles.optionBtn, ...styles.optionCorrect };
            optTextStyle = { ...styles.optionText, color: "#fff" };
          } else if (idx === selected) {
            optStyle = { ...styles.optionBtn, ...styles.optionWrong };
            optTextStyle = { ...styles.optionText, color: "#fff" };
          }
        }

        return (
          <TouchableOpacity
            key={idx}
            style={optStyle}
            onPress={() => handleSelect(idx)}
            activeOpacity={showResult ? 1 : 0.7}
          >
            <Text style={optTextStyle}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {showResult && (
        <View style={[styles.explanationBox, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
          <Text style={styles.explanationLabel}>{isCorrect ? "✅ Correct!" : "❌ Not quite!"}</Text>
          <Text style={styles.explanationText}>{q.explanation}</Text>
        </View>
      )}

      {showResult && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {currentQ + 1 >= QUIZ_QUESTIONS.length ? "See Results" : "Next Question →"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────

export default function LessonsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <Text style={styles.title}>Lessons</Text>
      <Text style={styles.subtitle}>Learn how money really works.</Text>

      {/* Lesson Card */}
      <View style={styles.lessonCard}>
        <View style={styles.lessonBadge}>
          <Text style={styles.lessonBadgeText}>💳 Lesson 1</Text>
        </View>
        <Text style={styles.lessonTitle}>Credit vs. Debit</Text>
        <Text style={styles.lessonBody}>
          Both credit and debit cards look the same, but they work very differently. Knowing the
          difference can save you from debt and help you make smarter money choices!
        </Text>

        {/* Quick Comparison */}
        <View style={styles.compareRow}>
          <View style={[styles.compareBox, styles.compareDebit]}>
            <Text style={styles.compareEmoji}>🏦</Text>
            <Text style={styles.compareLabel}>Debit</Text>
            <Text style={styles.comparePoint}>Your own money</Text>
            <Text style={styles.comparePoint}>Instant spending</Text>
            <Text style={styles.comparePoint}>No interest</Text>
            <Text style={styles.comparePoint}>Can't overspend</Text>
          </View>
          <View style={[styles.compareBox, styles.compareCredit]}>
            <Text style={styles.compareEmoji}>💳</Text>
            <Text style={styles.compareLabel}>Credit</Text>
            <Text style={styles.comparePoint}>Borrowed money</Text>
            <Text style={styles.comparePoint}>Pay later</Text>
            <Text style={styles.comparePoint}>Interest if late</Text>
            <Text style={styles.comparePoint}>Builds credit score</Text>
          </View>
        </View>
      </View>

      {/* Flip Cards Section */}
      <Text style={styles.sectionHeader}>🔄 Tap to Learn</Text>
      <Text style={styles.sectionSub}>Flip each card to discover key money terms</Text>

      <FlatList
        data={FLIP_CARDS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flipList}
        renderItem={({ item }) => <FlipCard card={item} />}
      />

      {/* Real-World Examples */}
      <Text style={styles.sectionHeader}>🌍 Real-World Examples</Text>

      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>🛒 Buying Groceries</Text>
        <Text style={styles.exampleText}>
          <Text style={styles.bold}>Debit: </Text>$30 leaves your account instantly. You always know
          exactly what you have.{"\n"}
          <Text style={styles.bold}>Credit: </Text>Bank pays the $30 now. You repay at end of month.
          If you forget, you pay extra interest!
        </Text>
      </View>

      <View style={styles.exampleCard}>
        <Text style={styles.exampleTitle}>🚨 Emergency Car Repair</Text>
        <Text style={styles.exampleText}>
          <Text style={styles.bold}>Debit: </Text>You need $500 in your account right now or you're
          stuck.{"\n"}
          <Text style={styles.bold}>Credit: </Text>You can pay the $500 now and spread repayment over
          time — useful in emergencies!
        </Text>
      </View>

      {/* Quiz Section */}
      <Text style={styles.sectionHeader}>🧠 Quiz Time!</Text>
      <Text style={styles.sectionSub}>Test what you've learned</Text>

      <QuizSection />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────

const ACCENT = colors.accent ?? "#D4A017";
const ACCENT_LIGHT = colors.accentLight ?? "#FFF8E1";
const DEBIT_COLOR = "#4CAF7C";
const CREDIT_COLOR = "#E07B39";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ACCENT_LIGHT,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: ACCENT,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#7C6A33",
    fontSize: 14,
  },

  // ── Lesson Card ──
  lessonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lessonBadge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  lessonBadgeText: {
    color: ACCENT,
    fontWeight: "700",
    fontSize: 12,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  lessonBody: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    marginBottom: 16,
  },
  compareRow: {
    flexDirection: "row",
    gap: 10,
  },
  compareBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  compareDebit: {
    backgroundColor: "#E8F8EF",
  },
  compareCredit: {
    backgroundColor: "#FEF0E6",
  },
  compareEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  compareLabel: {
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 6,
    color: "#2C2C2C",
  },
  comparePoint: {
    fontSize: 12,
    color: "#555",
    marginBottom: 3,
    textAlign: "center",
  },

  // ── Section Headers ──
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C2C2C",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#7C6A33",
    marginBottom: 12,
  },

  // ── Flip Cards ──
  flipList: {
    paddingBottom: 8,
    paddingRight: 16,
    marginBottom: 20,
  },
  flipWrapper: {
    width: 180,
    height: 200,
    marginRight: 12,
  },
  flipCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  flipFront: {
    backgroundColor: ACCENT,
  },
  flipBack: {
    backgroundColor: "#2C2C2C",
  },
  flipEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  flipFrontText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  flipBackText: {
    fontSize: 13,
    color: "#fff",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 8,
  },
  flipHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontStyle: "italic",
  },

  // ── Examples ──
  exampleCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#2C2C2C",
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#2C2C2C",
  },

  // ── Quiz ──
  quizBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
  },
  progressDotDone: {
    backgroundColor: DEBIT_COLOR,
  },
  progressDotActive: {
    backgroundColor: ACCENT,
    width: 24,
    borderRadius: 5,
  },
  quizCounter: {
    fontSize: 12,
    color: "#7C6A33",
    fontWeight: "600",
    marginBottom: 6,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 14,
    lineHeight: 22,
  },
  optionBtn: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FAFAFA",
  },
  optionText: {
    fontSize: 14,
    color: "#2C2C2C",
  },
  optionCorrect: {
    backgroundColor: DEBIT_COLOR,
    borderColor: DEBIT_COLOR,
  },
  optionWrong: {
    backgroundColor: CREDIT_COLOR,
    borderColor: CREDIT_COLOR,
  },
  explanationBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  explanationCorrect: {
    backgroundColor: "#E8F8EF",
  },
  explanationWrong: {
    backgroundColor: "#FEF0E6",
  },
  explanationLabel: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    color: "#2C2C2C",
  },
  explanationText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
  nextBtn: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  // ── Finished ──
  finishedBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  finishedEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  finishedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  finishedScore: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
});
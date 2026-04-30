import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ═══════════════════════════════════════════════════════════════════
// BUCKS FINANCIAL LITERACY — Lessons for ages 7–9
// ═══════════════════════════════════════════════════════════════════

type LessonId = "needs-wants" | "borrowing" | "growth";

type Lesson = {
  id: LessonId;
  number: number;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  lightColor: string;
};

const LESSONS: Lesson[] = [
  {
    id: "needs-wants",
    number: 1,
    emoji: "🦴",
    title: "Need It or Want It?",
    subtitle: "Bucks finds $20!",
    color: "#7C5CBF",   // 💜 main purple
    lightColor: "#F3F1FF",
  },
  {
    id: "borrowing",
    number: 2,
    emoji: "💰",
    title: "Bucks Borrows a Bone",
    subtitle: "Loans & interest",
    color: "#A66DD4",   // 💜 lighter purple
    lightColor: "#F7F3FF",
  },
  {
    id: "growth",
    number: 3,
    emoji: "🌱",
    title: "Watch Money Grow!",
    subtitle: "The magic of compound",
    color: "#5E4AE3",   // 💜 deeper purple
    lightColor: "#F1F0FF",
  },
];

// ═══════════════════════════════════════════════════════════════════
// BUCKS MASCOT
// ═══════════════════════════════════════════════════════════════════

type BucksMood = "idle" | "happy" | "sad" | "excited" | "thinking";

const BUCKS_FACES: Record<BucksMood, string> = {
  idle: "🐕",
  happy: "🐶",
  sad: "😢",
  excited: "🤩",
  thinking: "🤔",
};

const BUCKS_LINES: Record<BucksMood, string[]> = {
  idle: ["Let's learn!", "Ready, pup?", "You got this!"],
  happy: ["Woof! Nice!", "Good job!", "You're smart!", "Pawsome!"],
  sad: ["Try again!", "Almost!", "Keep going!"],
  excited: ["AMAZING!", "WOOHOO!", "YOU DID IT!"],
  thinking: ["Hmm...", "Think hard!", "You can do it!"],
};

function BucksMascot({ mood }: { mood: BucksMood }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const [line, setLine] = useState("");

  useEffect(() => {
    const lines = BUCKS_LINES[mood];
    setLine(lines[Math.floor(Math.random() * lines.length)]);
    bounce.setValue(0);
    Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [mood]);

  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const showBubble = mood !== "idle";

  return (
    <View style={styles.mascotWrap} pointerEvents="none">
      {showBubble && (
        <Animated.View style={[styles.speechBubble, { opacity: bounce }]}>
          <Text style={styles.speechText}>{line}</Text>
          <View style={styles.speechTail} />
        </Animated.View>
      )}
      <Animated.Text style={[styles.mascotEmoji, { transform: [{ scale }] }]}>
        {BUCKS_FACES[mood]}
      </Animated.Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COIN RAIN
// ═══════════════════════════════════════════════════════════════════

function CoinRain({ trigger }: { trigger: number }) {
  const coins = useRef(
    Array.from({ length: 8 }, () => ({
      anim: new Animated.Value(0),
      x: Math.random() * 300,
      delay: Math.random() * 200,
      emoji: ["💰", "🪙", "💵", "🦴"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  useEffect(() => {
    if (trigger === 0) return;
    coins.forEach((c) => {
      c.anim.setValue(0);
      c.x = Math.random() * 300;
      c.delay = Math.random() * 200;
      c.emoji = ["💰", "🪙", "💵", "🦴"][Math.floor(Math.random() * 4)];
    });
    Animated.stagger(
      50,
      coins.map((c) =>
        Animated.timing(c.anim, {
          toValue: 1,
          duration: 1400,
          delay: c.delay,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [trigger]);

  return (
    <View style={styles.coinRainWrap} pointerEvents="none">
      {coins.map((c, i) => {
        const translateY = c.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-80, 600],
        });
        const rotate = c.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });
        const opacity = c.anim.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.coin,
              {
                left: c.x,
                opacity,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          >
            {c.emoji}
          </Animated.Text>
        );
      })}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BONE COUNTER
// ═══════════════════════════════════════════════════════════════════

function BoneCounter({ count }: { count: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.spring(pulse, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    }
    prevCount.current = count;
  }, [count]);

  return (
    <Animated.View style={[styles.boneCounter, { transform: [{ scale: pulse }] }]}>
      <Text style={styles.boneCounterEmoji}>🦴</Text>
      <Text style={styles.boneCounterText}>{count}</Text>
    </Animated.View>
  );
}

// ── Story Data ────────────────────────────────────────────────────

type StoryPage = { emoji: string; text: string };

const STORIES: Record<LessonId, StoryPage[]> = {
  "needs-wants": [
    { emoji: "🐕", text: "Meet Bucks! He loves bones and money." },
    { emoji: "💵", text: "One day, Bucks finds $20 on the sidewalk!" },
    { emoji: "🤔", text: "His bowl is empty. He needs food. But he WANTS a squeaky toy!" },
    { emoji: "✨", text: "A NEED is something you must have. A WANT is something that would be fun." },
    { emoji: "🦴", text: "Dog food costs $15. The toy costs $12. He can't buy BOTH!" },
    { emoji: "🎯", text: "What you give up is called OPPORTUNITY COST." },
  ],
  borrowing: [
    { emoji: "🛹", text: "Bucks sees a shiny skateboard for $50!" },
    { emoji: "🐽", text: "But his piggy bank only has $20. He's $30 short!" },
    { emoji: "🐶", text: "Rex says: 'I'll lend you $30! But pay me back $35.'" },
    { emoji: "💸", text: "That extra $5 is called INTEREST — the fee for borrowing." },
    { emoji: "✅", text: "GOOD DEBT helps you earn more later (like college)." },
    { emoji: "❌", text: "BAD DEBT buys stuff you don't really need." },
  ],
  growth: [
    { emoji: "🐷", text: "Bucks saved $100! Where should he keep it?" },
    { emoji: "🏦", text: "A bank will PAY him to keep money there. It's called interest!" },
    { emoji: "📏", text: "SIMPLE interest: earn the same amount every year." },
    { emoji: "❄️", text: "COMPOUND interest: a snowball that grows BIGGER each year!" },
    { emoji: "🚀", text: "$100 becomes $259 after 10 years with compound. Magic!" },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// SHARED: Story Carousel
// ═══════════════════════════════════════════════════════════════════

function StoryCarousel({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const [page, setPage] = useState(0);
  const pages = STORIES[lesson.id];
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    bounce.setValue(0);
    Animated.spring(bounce, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [page]);

  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <View style={[styles.storyBox, { backgroundColor: lesson.lightColor }]}>
      <View style={styles.storyDots}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.storyDot,
              i === page && { backgroundColor: lesson.color, width: 24 },
              i < page && { backgroundColor: lesson.color },
            ]}
          />
        ))}
      </View>

      <Animated.Text style={[styles.storyEmoji, { transform: [{ scale }] }]}>
        {pages[page].emoji}
      </Animated.Text>
      <Text style={styles.storyText}>{pages[page].text}</Text>

      <TouchableOpacity
        style={[styles.bigBtn, { backgroundColor: lesson.color }]}
        onPress={() => (page + 1 >= pages.length ? onDone() : setPage((p) => p + 1))}
        activeOpacity={0.8}
      >
        <Text style={styles.bigBtnText}>
          {page + 1 >= pages.length ? "Let's Play! 🎮" : "Next →"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LESSON 1 GAME: Sort Needs vs Wants
// ═══════════════════════════════════════════════════════════════════

type SortItem = { id: string; emoji: string; label: string; answer: "need" | "want" };

const SORT_ITEMS: SortItem[] = [
  { id: "s1", emoji: "🥦", label: "Food", answer: "need" },
  { id: "s2", emoji: "🎮", label: "Video game", answer: "want" },
  { id: "s3", emoji: "💊", label: "Medicine", answer: "need" },
  { id: "s4", emoji: "🍭", label: "Candy", answer: "want" },
  { id: "s5", emoji: "🧥", label: "Winter coat", answer: "need" },
  { id: "s6", emoji: "👟", label: "Fancy sneakers", answer: "want" },
  { id: "s7", emoji: "🪥", label: "Toothbrush", answer: "need" },
  { id: "s8", emoji: "🎬", label: "Movie ticket", answer: "want" },
];

function NeedsWantsGame({
  onDone,
  onCorrect,
  onWrong,
}: {
  onDone: () => void;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const item = SORT_ITEMS[idx];
  const done = idx >= SORT_ITEMS.length;

  const handleSort = (choice: "need" | "want") => {
    if (feedback) return;
    const correct = choice === item.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setScore((s) => s + 1);
      onCorrect();
    } else {
      onWrong();
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
    setTimeout(() => {
      setFeedback(null);
      setIdx((i) => i + 1);
    }, 800);
  };

  if (done) {
    return (
      <View style={styles.gameBox}>
        <Text style={styles.gameDoneEmoji}>🏆</Text>
        <Text style={styles.gameDoneTitle}>Sorting Complete!</Text>
        <Text style={styles.gameDoneScore}>
          You got {score} out of {SORT_ITEMS.length}!
        </Text>
        <TouchableOpacity style={[styles.bigBtn, { backgroundColor: "#4CAF7C" }]} onPress={onDone}>
          <Text style={styles.bigBtnText}>Next: Quiz Time! 🧠</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.gameBox}>
      <Text style={styles.gameTitle}>🎯 Tap NEED or WANT</Text>
      <Text style={styles.gameCounter}>
        {idx + 1} of {SORT_ITEMS.length} • Score: {score} ⭐
      </Text>

      <Animated.View
        style={[
          styles.sortCard,
          { transform: [{ translateX: shake }] },
          feedback === "correct" && { backgroundColor: "#E8F8EF", borderColor: "#4CAF7C" },
          feedback === "wrong" && { backgroundColor: "#FEE", borderColor: "#E07B39" },
        ]}
      >
        <Text style={styles.sortEmoji}>{item.emoji}</Text>
        <Text style={styles.sortLabel}>{item.label}</Text>
        {feedback === "correct" && <Text style={styles.sortFeedback}>✅ Yes!</Text>}
        {feedback === "wrong" && (
          <Text style={styles.sortFeedback}>
            Actually a {item.answer.toUpperCase()}!
          </Text>
        )}
      </Animated.View>

      <View style={styles.sortBtnRow}>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: "#4CAF7C" }]}
          onPress={() => handleSort("need")}
          activeOpacity={0.8}
        >
          <Text style={styles.sortBtnEmoji}>🫶</Text>
          <Text style={styles.sortBtnText}>NEED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: "#E07B39" }]}
          onPress={() => handleSort("want")}
          activeOpacity={0.8}
        >
          <Text style={styles.sortBtnEmoji}>✨</Text>
          <Text style={styles.sortBtnText}>WANT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LESSON 2 GAME: Coin Counter
// ═══════════════════════════════════════════════════════════════════

function CoinCounterGame({ onDone }: { onDone: () => void }) {
  const [borrowed, setBorrowed] = useState(100);
  const [rate, setRate] = useState(10);

  const interest = Math.round(borrowed * (rate / 100));
  const total = borrowed + interest;

  return (
    <View style={styles.gameBox}>
      <Text style={styles.gameTitle}>💰 Interest Machine</Text>
      <Text style={styles.gameSubtitle}>Tap + and − to change numbers!</Text>

      <View style={styles.counterRow}>
        <Text style={styles.counterLabel}>Bucks borrows:</Text>
        <View style={styles.counterControls}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setBorrowed((b) => Math.max(10, b - 10))}>
            <Text style={styles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>${borrowed}</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setBorrowed((b) => Math.min(500, b + 10))}>
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.counterRow}>
        <Text style={styles.counterLabel}>Interest rate:</Text>
        <View style={styles.counterControls}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setRate((r) => Math.max(5, r - 5))}>
            <Text style={styles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{rate}%</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setRate((r) => Math.min(50, r + 5))}>
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultRow}>
          💵 Extra (interest): <Text style={styles.resultValue}>${interest}</Text>
        </Text>
        <View style={styles.resultDivider} />
        <Text style={styles.resultBig}>
          Pay back: <Text style={{ color: "#E07B39" }}>${total}</Text>
        </Text>
      </View>

      <Text style={styles.tipText}>💡 Higher rate = MORE money to pay back!</Text>

      <TouchableOpacity style={[styles.bigBtn, { backgroundColor: "#E07B39" }]} onPress={onDone}>
        <Text style={styles.bigBtnText}>Next: Quiz Time! 🧠</Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LESSON 3 GAME: Growth Race
// ═══════════════════════════════════════════════════════════════════

function GrowthRaceGame({ onDone }: { onDone: () => void }) {
  const [year, setYear] = useState(0);
  const maxYear = 10;
  const start = 100;
  const rate = 0.1;

  const simple = start + start * rate * year;
  const compound = start * Math.pow(1 + rate, year);
  const maxVal = start * Math.pow(1 + rate, maxYear);

  const simpleWidth = useRef(new Animated.Value(0)).current;
  const compoundWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(simpleWidth, {
        toValue: (simple / maxVal) * 100,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(compoundWidth, {
        toValue: (compound / maxVal) * 100,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [year]);

  return (
    <View style={styles.gameBox}>
      <Text style={styles.gameTitle}>🚀 Money Race!</Text>
      <Text style={styles.gameSubtitle}>Start with $100. Tap to fast-forward!</Text>

      <View style={styles.yearBadge}>
        <Text style={styles.yearBadgeText}>Year {year}</Text>
      </View>

      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>📏 Simple</Text>
        <Text style={styles.barValue}>${simple.toFixed(0)}</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: "#4CAF7C",
              width: simpleWidth.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
            },
          ]}
        />
      </View>

      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>❄️ Compound</Text>
        <Text style={styles.barValue}>${compound.toFixed(0)}</Text>
      </View>
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: "#6C63FF",
              width: compoundWidth.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
            },
          ]}
        />
      </View>

      <View style={styles.yearControls}>
        <TouchableOpacity style={styles.counterBtn} onPress={() => setYear((y) => Math.max(0, y - 1))}>
          <Text style={styles.counterBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fastForwardBtn} onPress={() => setYear((y) => Math.min(maxYear, y + 1))}>
          <Text style={styles.fastForwardText}>⏩ Next Year</Text>
        </TouchableOpacity>
      </View>

      {year >= maxYear && (
        <Text style={styles.tipText}>
          🤯 Compound earned ${(compound - simple).toFixed(0)} MORE than simple!
        </Text>
      )}

      <TouchableOpacity style={[styles.bigBtn, { backgroundColor: "#6C63FF" }]} onPress={onDone}>
        <Text style={styles.bigBtnText}>Next: Quiz Time! 🧠</Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════

type QuizQ = {
  question: string;
  emoji: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QUIZZES: Record<LessonId, QuizQ[]> = {
  "needs-wants": [
    {
      emoji: "🍎",
      question: "Which one is a NEED?",
      options: ["Candy 🍬", "Food 🥗", "Toy car 🚗", "Sticker 💫"],
      correctIndex: 1,
      explanation: "Food keeps you healthy and alive. That's a need!",
    },
    {
      emoji: "💰",
      question: "Bucks has $20. He buys a $12 toy. How much is left?",
      options: ["$8", "$10", "$12", "$32"],
      correctIndex: 0,
      explanation: "$20 − $12 = $8. Now he can't afford $15 dog food!",
    },
    {
      emoji: "🎯",
      question: "What is 'opportunity cost'?",
      options: [
        "Money you find",
        "What you give up when you choose",
        "A type of toy",
        "Free stuff",
      ],
      correctIndex: 1,
      explanation: "Every choice means giving something else up. That's opportunity cost!",
    },
    {
      emoji: "🤔",
      question: "Bucks has $20. What should he buy FIRST?",
      options: ["The $12 toy", "The $15 dog food", "Nothing", "Both"],
      correctIndex: 1,
      explanation: "Food is a NEED. Always take care of needs before wants!",
    },
  ],
  borrowing: [
    {
      emoji: "💸",
      question: "What is INTEREST?",
      options: ["Free money", "The fee for borrowing", "A type of bank", "A coin"],
      correctIndex: 1,
      explanation: "Interest is the extra money you pay for borrowing. It's a fee!",
    },
    {
      emoji: "🧮",
      question: "Borrow $100 at 10% interest. How much EXTRA do you pay?",
      options: ["$1", "$10", "$100", "$110"],
      correctIndex: 1,
      explanation: "$100 × 10% = $10. You pay back $110 total.",
    },
    {
      emoji: "🎓",
      question: "Which is GOOD debt?",
      options: [
        "Borrow for candy",
        "Borrow to learn a skill",
        "Borrow for a toy",
        "Borrow for gum",
      ],
      correctIndex: 1,
      explanation: "Good debt helps you earn MORE money later. Like learning!",
    },
    {
      emoji: "⏰",
      question: "The LONGER you take to pay back a loan...",
      options: [
        "The less you owe",
        "The more interest you owe",
        "Nothing changes",
        "It disappears",
      ],
      correctIndex: 1,
      explanation: "More time = more interest stacking up. Pay back fast!",
    },
  ],
  growth: [
    {
      emoji: "❄️",
      question: "Compound interest earns interest on...",
      options: [
        "Only your original money",
        "Your money AND past interest",
        "Nothing",
        "Only on Mondays",
      ],
      correctIndex: 1,
      explanation: "That's why it grows so fast — like a rolling snowball!",
    },
    {
      emoji: "📏",
      question: "Simple interest means you earn...",
      options: [
        "A different amount each year",
        "The same amount each year",
        "Nothing",
        "Double every year",
      ],
      correctIndex: 1,
      explanation: "Simple = the same $ every year, always on your starting amount.",
    },
    {
      emoji: "🐷",
      question: "Does a piggy bank at home earn interest?",
      options: ["Yes, lots!", "No, never", "Only on weekends", "Maybe"],
      correctIndex: 1,
      explanation: "Piggy banks don't grow. Only banks pay you interest!",
    },
    {
      emoji: "⏳",
      question: "When is the BEST time to start saving?",
      options: ["When you're old", "As early as possible", "Never", "Only on your birthday"],
      correctIndex: 1,
      explanation: "The earlier you start, the more time compound has to grow your money!",
    },
  ],
};

function QuizGame({
  lesson,
  onDone,
  onCorrect,
  onWrong,
}: {
  lesson: Lesson;
  onDone: (score: number, total: number) => void;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const questions = QUIZZES[lesson.id];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[idx];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (i: number) => {
    if (showResult) return;
    setSelected(i);
    setShowResult(true);
    if (i === q.correctIndex) {
      setScore((s) => s + 1);
      onCorrect();
    } else {
      onWrong();
    }
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      onDone(score, questions.length);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <View style={styles.gameBox}>
      <View style={styles.progressRow}>
        {questions.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < idx && { backgroundColor: lesson.color },
              i === idx && { backgroundColor: lesson.color, width: 24 },
            ]}
          />
        ))}
      </View>

      <Text style={styles.quizEmoji}>{q.emoji}</Text>
      <Text style={styles.quizQuestion}>{q.question}</Text>

      {q.options.map((opt, i) => {
        let bg = "#FAFAFA";
        let border = "#E0E0E0";
        let color = "#2C2C2C";
        if (showResult) {
          if (i === q.correctIndex) {
            bg = "#4CAF7C";
            border = "#4CAF7C";
            color = "#fff";
          } else if (i === selected) {
            bg = "#E07B39";
            border = "#E07B39";
            color = "#fff";
          }
        }
        return (
          <TouchableOpacity
            key={i}
            style={[styles.optionBtn, { backgroundColor: bg, borderColor: border }]}
            onPress={() => handleSelect(i)}
            activeOpacity={showResult ? 1 : 0.7}
          >
            <Text style={[styles.optionText, { color }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {showResult && (
        <View
          style={[
            styles.explanationBox,
            { backgroundColor: isCorrect ? "#E8F8EF" : "#FEF0E6" },
          ]}
        >
          <Text style={styles.explanationLabel}>
            {isCorrect ? "✅ Awesome!" : "❌ Not quite!"}
          </Text>
          <Text style={styles.explanationText}>{q.explanation}</Text>
        </View>
      )}

      {showResult && (
        <TouchableOpacity
          style={[styles.bigBtn, { backgroundColor: lesson.color }]}
          onPress={handleNext}
        >
          <Text style={styles.bigBtnText}>
            {idx + 1 >= questions.length ? "Finish! 🎉" : "Next →"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPLETE
// ═══════════════════════════════════════════════════════════════════

function LessonComplete({
  lesson,
  score,
  total,
  onHome,
}: {
  lesson: Lesson;
  score: number;
  total: number;
  onHome: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const stars = pct === 100 ? 3 : pct >= 75 ? 2 : pct >= 50 ? 1 : 0;

  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.gameBox, { alignItems: "center" }]}>
      <Animated.Text style={[styles.completeEmoji, { transform: [{ scale: bounce }] }]}>
        🎉
      </Animated.Text>
      <Text style={styles.completeTitle}>Lesson Complete!</Text>

      <View style={styles.starRow}>
        {[1, 2, 3].map((i) => (
          <Text key={i} style={[styles.star, { opacity: i <= stars ? 1 : 0.2 }]}>
            ⭐
          </Text>
        ))}
      </View>

      <Text style={styles.completeScore}>
        {score} / {total} correct
      </Text>

      <TouchableOpacity
        style={[styles.bigBtn, { backgroundColor: lesson.color, marginTop: 20 }]}
        onPress={onHome}
      >
        <Text style={styles.bigBtnText}>Back to Lessons 🏠</Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FLOW
// ═══════════════════════════════════════════════════════════════════

type Stage = "story" | "game" | "quiz" | "complete";

function LessonView({
  lesson,
  onBack,
  bones,
  setBones,
}: {
  lesson: Lesson;
  onBack: () => void;
  bones: number;
  setBones: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [stage, setStage] = useState<Stage>("story");
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [mood, setMood] = useState<BucksMood>("idle");
  const [coinTrigger, setCoinTrigger] = useState(0);

  useEffect(() => {
    if (mood === "idle") return;
    const t = setTimeout(() => setMood("idle"), 2000);
    return () => clearTimeout(t);
  }, [mood]);

  const handleCorrect = () => {
    setBones((b) => b + 1);
    setMood("happy");
    setCoinTrigger((t) => t + 1);
  };

  const handleWrong = () => setMood("sad");

  const renderGame = () => {
    switch (lesson.id) {
      case "needs-wants":
        return <NeedsWantsGame onDone={() => setStage("quiz")} onCorrect={handleCorrect} onWrong={handleWrong} />;
      case "borrowing":
        return <CoinCounterGame onDone={() => setStage("quiz")} />;
      case "growth":
        return <GrowthRaceGame onDone={() => setStage("quiz")} />;
    }
  };

  return (
    <ImageBackground source={require("../../assets/LessonsBG.png")} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
        <View style={{ flex: 1, minWidth: 120 }}>
          <ScrollView
            style={[styles.container]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.lessonHeader}>
              <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lessonHeaderNum, { color: lesson.color }]}>
                  Lesson {lesson.number}
                </Text>
                <Text style={styles.lessonHeaderTitle}>
                  {lesson.emoji} {lesson.title}
                </Text>
              </View>
              <BoneCounter count={bones} />
            </View>

            <View style={styles.stageRow}>
              {(["story", "game", "quiz"] as Stage[]).map((s, i) => {
                const stageIdx = ["story", "game", "quiz", "complete"].indexOf(stage);
                const active = i <= stageIdx;
                return (
                  <View key={s} style={styles.stageItem}>
                    <View style={[styles.stageCircle, { backgroundColor: active ? lesson.color : "#E0E0E0" }]}>
                      <Text style={styles.stageCircleText}>
                        {s === "story" ? "📖" : s === "game" ? "🎮" : "🧠"}
                      </Text>
                    </View>
                    {i < 2 && (
                      <View
                        style={[
                          styles.stageLine,
                          { backgroundColor: i < stageIdx ? lesson.color : "#E0E0E0" },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            {stage === "story" && <StoryCarousel lesson={lesson} onDone={() => setStage("game")} />}
            {stage === "game" && renderGame()}
            {stage === "quiz" && (
              <QuizGame
                lesson={lesson}
                onCorrect={handleCorrect}
                onWrong={handleWrong}
                onDone={(score, total) => {
                  setFinalScore({ score, total });
                  setStage("complete");
                  setMood("excited");
                }}
              />
            )}
            {stage === "complete" && (
              <LessonComplete
                lesson={lesson}
                score={finalScore.score}
                total={finalScore.total}
                onHome={onBack}
              />
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
          <CoinRain trigger={coinTrigger} />
          <BucksMascot mood={mood} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function LessonsScreen() {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [bones, setBones] = useState(0);

  if (selected) {
    return (
      <LessonView
        lesson={selected}
        onBack={() => setSelected(null)}
        bones={bones}
        setBones={setBones}
      />
    );
  }

  return (
    <ImageBackground source={require("../../assets/LessonsBG.png")} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.homeTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>🦴 Bucks Academy</Text>
              <Text style={styles.subtitle}>Pick a lesson to start!</Text>
            </View>
            <BoneCounter count={bones} />
          </View>

          <View style={styles.bonesBanner}>
            <Text style={styles.bonesBannerEmoji}>🦴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bonesBannerLabel}>Bones Collected</Text>
              <Text style={styles.bonesBannerCount}>{bones}</Text>
            </View>
            <Text style={styles.bonesBannerMsg}>
              {bones === 0
                ? "Start a lesson to earn bones!"
                : bones < 5
                ? "Great start! 🐾"
                : bones < 15
                ? "You're on fire! 🔥"
                : "Bucks is so proud! 🏆"}
            </Text>
          </View>

          {LESSONS.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => setSelected(lesson)}
              activeOpacity={0.85}
            >
              <View style={[styles.lessonIconBox, { backgroundColor: lesson.color + "CC" }]}>
                <Text style={styles.lessonIcon}>{lesson.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lessonNum, { color: lesson.color }]}>
                  LESSON {lesson.number}
                </Text>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
              </View>
              <Text style={[styles.playArrow, { color: lesson.color }]}>▶</Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const ACCENT = "#7C5CBF";
const ACCENT_LIGHT = "rgba(255,255,255,0.92)";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  container: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { padding: 20, paddingTop: 24, flexGrow: 1 },

  title: { fontSize: 36, fontWeight: "800", color: "#3B2A6E", marginTop: 8 },
  subtitle: { marginTop: 6, marginBottom: 16, color: "#6B5A9E", fontSize: 17 },

  homeTitleRow: { flexDirection: "row", alignItems: "flex-start" },

  bonesBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: ACCENT,
  },

  bonesBannerEmoji: { fontSize: 40, marginRight: 12 },
  bonesBannerLabel: { fontSize: 12, fontWeight: "800", color: "#7C6A33" },
  bonesBannerCount: { fontSize: 32, fontWeight: "800", color: ACCENT },
  bonesBannerMsg: { fontSize: 12, fontWeight: "700", color: "#7C6A33" },

  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  lessonIconBox: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14 },
  lessonIcon: { fontSize: 36 },
  lessonNum: { fontSize: 11, fontWeight: "800" },
  lessonTitle: { fontSize: 18, fontWeight: "800", color: "#2C2C2C",},
  lessonSubtitle: { fontSize: 13 },
  playArrow: { fontSize: 24 },

  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  backBtnText: { fontSize: 22, fontWeight: "800", color: "#2C2C2C" },
  lessonHeaderNum: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  lessonHeaderTitle: { fontSize: 20, fontWeight: "800", color: "#2C2C2C" },

  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  stageItem: { flexDirection: "row", alignItems: "center" },
  stageCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  stageCircleText: { fontSize: 20 },
  stageLine: { width: 32, height: 4, marginHorizontal: 4, borderRadius: 2 },

  storyBox: {
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    minHeight: 480,
    justifyContent: "space-between",
  },
  storyDots: { flexDirection: "row", gap: 6, marginBottom: 12 },
  storyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#E0E0E0" },
  storyEmoji: { fontSize: 140, marginVertical: 12 },
  storyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 16,
  },

  bigBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 8,
  },
  bigBtnText: { color: "#fff", fontWeight: "800", fontSize: 17 },

  gameBox: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    minHeight: 480,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2C2C2C",
    textAlign: "center",
  },
  gameSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  gameCounter: {
    fontSize: 13,
    color: "#7C6A33",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },

  sortCard: {
    backgroundColor: "#FAFAFA",
    borderWidth: 3,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  sortEmoji: { fontSize: 72 },
  sortLabel: { fontSize: 22, fontWeight: "800" },
  sortFeedback: { fontSize: 16, fontWeight: "800", marginTop: 8 },
  sortBtnRow: { flexDirection: "row", gap: 12 },
  sortBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  sortBtnEmoji: { fontSize: 32 },
  sortBtnText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  counterControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E07B39",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnText: { color: "#fff", fontSize: 24, fontWeight: "800" },
  counterValue: { fontSize: 20, fontWeight: "800" },

  resultBox: {
    backgroundColor: "#FEF0E6",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  resultRow: { fontSize: 15 },
  resultValue: { fontWeight: "800", color: "#E07B39" },
  resultDivider: { height: 1, marginVertical: 8 },
  resultBig: { fontSize: 20, fontWeight: "800" },

  tipText: { fontSize: 13, color: "#666", textAlign: "center" },

  yearBadge: {
    alignSelf: "center",
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  yearBadgeText: { color: "#fff", fontWeight: "800" },

  barTrack: {
    height: 24,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginBottom: 4,
  },
  barFill: { height: "100%" },

  yearControls: { flexDirection: "row", justifyContent: "center", gap: 12 },
  fastForwardBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  fastForwardText: { color: "#fff", fontWeight: "800" },

  progressRow: { flexDirection: "row", justifyContent: "center", gap: 6 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#E0E0E0" },

  quizEmoji: { fontSize: 64, textAlign: "center" },
  quizQuestion: { fontSize: 18, fontWeight: "800", textAlign: "center" },

  optionBtn: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  optionText: { fontSize: 16, fontWeight: "700", textAlign: "center" },

  explanationBox: { borderRadius: 14, padding: 14, marginTop: 4 },
  explanationLabel: { fontWeight: "800" },

  completeEmoji: { fontSize: 80 },
  completeTitle: { fontSize: 26, fontWeight: "800" },

  starRow: { flexDirection: "row", gap: 8 },
  star: { fontSize: 48 },

  boneCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  boneCounterEmoji: { fontSize: 18 },
  boneCounterText: { fontSize: 16, fontWeight: "800" },

  mascotWrap: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  mascotEmoji: { fontSize: 56 },

  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 4,
  },
  speechText: { fontSize: 14, fontWeight: "800" },

  coinRainWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coin: {
    position: "absolute",
    top: 0,
    fontSize: 32,
  },
});

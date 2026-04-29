import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Modal,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const lessonStages = [
  {
    id: 0,
    emoji: "🦴",
    title: "Earn Your Treats",
    subtitle: "How to get your allowance",
    desc: "You earn treats (money!) by doing chores and being helpful. The more you help, the more treats you get!",
    funFact: "🐾 Did you know? Dogs love treats — just like you love earning money!",
    color: "#FFD166",
    align: "left",
  },
  {
    id: 1,
    emoji: "🦴",
    title: "Save Some Bones",
    subtitle: "Saving = treats for later",
    desc: "Put some of your treats away in a special bowl. You can use them later for something really big — like a new toy!",
    funFact: "🐾 A dog that buries its bone is saving for later. Smart pup!",
    color: "#06D6A0",
    align: "right",
  },
  {
    id: 2,
    emoji: "🦴",
    title: "Spend Wisely",
    subtitle: "Use treats for fun things",
    desc: "It's okay to use some treats now! Just make sure you don't spend ALL your treats at once — always keep some in your bowl.",
    funFact: "🐾 Even puppies know not to eat all their food at once!",
    color: "#118AB2",
    align: "left",
  },
  {
    id: 3,
    emoji: "🦴",
    title: "Grow Your Treats",
    subtitle: "Investing = magic treats",
    desc: "When you invest, your treats grow all by themselves! Give 10 treats today, and later you'll have 12, then 15, then even more!",
    funFact: "🐾 This is called Compound Interest — it's like treat magic! 🪄",
    color: "#9B5DE5",
    align: "right",
  },
  {
    id: 4,
    emoji: "🏠",
    title: "Kennel House!",
    subtitle: "You're a Finance Pup! 🎉",
    desc: "You've learned how to earn, save, spend, and invest. You're ready to be a smart money dog! Paula Paw is proud of you.",
    funFact: "🐾 Woof woof! You did it! Ask your parents to unlock your next adventure!",
    color: "#EF476F",
    align: "center",
  },
];

const alignX = { left: 0.15, center: 0.5, right: 0.82 };

export default function RewardScreen() {
  const [currentStage, setCurrentStage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState(lessonStages[0]);

  const dogAnim = useRef(new Animated.Value(0)).current;
  const pulseAnims = useRef(lessonStages.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnims[currentStage], {
          toValue: 1.18,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnims[currentStage], {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentStage]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(dogAnim, { toValue: -16, duration: 180, useNativeDriver: true }),
      Animated.timing(dogAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [currentStage]);

  const openLesson = (stage: typeof lessonStages[0]) => {
    if (stage.id > currentStage) return;
    setSelectedStage(stage);
    setModalVisible(true);
  };

  const completeLesson = () => {
    setModalVisible(false);
    if (currentStage < lessonStages.length - 1) {
      setCurrentStage((prev) => prev + 1);
    }
  };

  const isCompleted = (id: number) => id < currentStage;
  const isActive = (id: number) => id === currentStage;
  const isLocked = (id: number) => id > currentStage;

  const progressPercent = (currentStage / (lessonStages.length - 1)) * 100;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>🎁 Rewards</Text>
            <Text style={styles.headerSub}>Follow the bones to the kennel 🐾</Text>
          </View>
          {/* Bones counter pill */}
          <View style={styles.bonesPill}>
            <Text style={styles.bonesPillEmoji}>🦴</Text>
            <Text style={styles.bonesPillText}>{currentStage}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {currentStage}/{lessonStages.length - 1} bones found
        </Text>
      </View>

      {/* Map */}
      <ScrollView
        contentContainerStyle={[
          styles.mapContainer,
          { height: lessonStages.length * 120 + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Paw print connectors */}
        {lessonStages.slice(0, -1).map((stage, i) => {
          const next = lessonStages[i + 1];
          const x1 = alignX[stage.align as keyof typeof alignX] * width;
          const x2 = alignX[next.align as keyof typeof alignX] * width;
          const y1 = i * 120 + 60;
          const y2 = (i + 1) * 120;
          const done = i < currentStage;
          return (
            <View
              key={`conn-${i}`}
              style={{
                position: "absolute",
                left: Math.min(x1, x2) - 2 + 28,
                top: y1,
                width: Math.abs(x2 - x1),
                height: y2 - y1,
              }}
            >
              {[0.3, 0.65].map((frac) => (
                <Text
                  key={frac}
                  style={{
                    position: "absolute",
                    left: frac * Math.abs(x2 - x1) - 8,
                    top: frac * (y2 - y1) - 8,
                    fontSize: 13,
                    opacity: done ? 0.85 : 0.2,
                  }}
                >
                  🐾
                </Text>
              ))}
            </View>
          );
        })}

        {/* Stage nodes */}
        {lessonStages.map((stage, i) => {
          const x = alignX[stage.align as keyof typeof alignX] * width - 32;
          const y = i * 120;
          const completed = isCompleted(stage.id);
          const active = isActive(stage.id);
          const locked = isLocked(stage.id);

          return (
            <Animated.View
              key={stage.id}
              style={[
                styles.nodeWrapper,
                {
                  left: x,
                  top: y,
                  transform: [
                    { scale: active ? pulseAnims[i] : 1 },
                    { translateY: active ? dogAnim : 0 },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={() => openLesson(stage)}
                style={[
                  styles.node,
                  completed && {
                    backgroundColor: stage.color,
                    borderColor: stage.color,
                    shadowColor: stage.color,
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  },
                  active && {
                    backgroundColor: stage.color,
                    borderColor: stage.color,
                    shadowColor: stage.color,
                    shadowOpacity: 0.55,
                    shadowRadius: 14,
                    elevation: 10,
                  },
                  locked && styles.nodeLocked,
                ]}
              >
                <Text style={[styles.nodeEmoji, locked && { opacity: 0.3 }]}>
                  {completed ? "✅" : locked ? "🔒" : stage.emoji}
                </Text>
              </Pressable>

              {active && (
                <Text style={styles.dogMarker}>🐶</Text>
              )}

              <View
                style={[
                  styles.labelBox,
                  stage.align === "right" && { alignItems: "flex-end" },
                  stage.align === "center" && { alignItems: "center" },
                ]}
              >
                <Text
                  style={[
                    styles.labelText,
                    completed && { color: "#1F4D3F" },
                    active && { color: "#1F4D3F", fontWeight: "800" },
                    locked && { color: "#B0CFC5" },
                  ]}
                >
                  {stage.title}
                </Text>
                {(completed || active) && (
                  <Text style={styles.labelSub}>{stage.subtitle}</Text>
                )}
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Lesson Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderTopColor: selectedStage.color }]}>
            {/* Colored top accent */}
            <View style={[styles.modalIconCircle, { backgroundColor: selectedStage.color + "22" }]}>
              <Text style={styles.modalEmoji}>{selectedStage.emoji}</Text>
            </View>

            <Text style={styles.modalTitle}>{selectedStage.title}</Text>
            <Text style={styles.modalSub}>{selectedStage.subtitle}</Text>

            <View style={styles.modalBody}>
              <Text style={styles.modalDesc}>{selectedStage.desc}</Text>
            </View>

            <View style={[styles.funFactBox, { borderLeftColor: selectedStage.color }]}>
              <Text style={styles.funFactText}>{selectedStage.funFact}</Text>
            </View>

            <Pressable
              style={[styles.modalBtn, { backgroundColor: selectedStage.color }]}
              onPress={completeLesson}
            >
              <Text style={styles.modalBtnText}>
                {selectedStage.id === currentStage && currentStage < lessonStages.length - 1
                  ? "Got it! Next Bone 🦴"
                  : selectedStage.id === lessonStages.length - 1
                  ? "Woof! I'm done! 🏠"
                  : "Review again"}
              </Text>
            </Pressable>

            <Pressable style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const NODE_SIZE = 64;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F0FAF4",
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F4D3F",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: "#5A9E8A",
    marginTop: 2,
  },
  bonesPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FAF4",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#C8E8D8",
  },
  bonesPillEmoji: {
    fontSize: 18,
  },
  bonesPillText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F4D3F",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#E0F0E8",
    borderRadius: 99,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#06D6A0",
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: 12,
    color: "#5A9E8A",
    textAlign: "right",
    fontWeight: "600",
  },

  // ── Map ─────────────────────────────────────────────────
  mapContainer: {
    position: "relative",
    marginTop: 24,
    paddingHorizontal: 0,
  },
  nodeWrapper: {
    position: "absolute",
    alignItems: "center",
    width: NODE_SIZE + 20,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#D0E8D8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeLocked: {
    backgroundColor: "#F0F7F3",
    borderColor: "#D0E8D8",
  },
  nodeEmoji: {
    fontSize: 28,
  },
  dogMarker: {
    fontSize: 22,
    position: "absolute",
    top: -28,
  },
  labelBox: {
    marginTop: 8,
    maxWidth: 100,
    alignItems: "flex-start",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F4D3F",
    textAlign: "center",
  },
  labelSub: {
    fontSize: 10,
    color: "#5A9E8A",
    textAlign: "center",
    marginTop: 1,
  },

  // ── Modal ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 44,
    borderTopWidth: 5,
    alignItems: "center",
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalEmoji: {
    fontSize: 44,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F4D3F",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  modalSub: {
    fontSize: 13,
    color: "#5A9E8A",
    marginTop: 3,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  modalBody: {
    backgroundColor: "#F0FAF4",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 15,
    color: "#1F4D3F",
    lineHeight: 24,
    textAlign: "center",
  },
  funFactBox: {
    width: "100%",
    borderLeftWidth: 4,
    paddingLeft: 14,
    paddingVertical: 10,
    marginBottom: 22,
    backgroundColor: "#F7FDFB",
    borderRadius: 10,
  },
  funFactText: {
    fontSize: 13,
    color: "#335F53",
    fontStyle: "italic",
    lineHeight: 20,
  },
  modalBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  modalClose: {
    paddingVertical: 8,
  },
  modalCloseText: {
    color: "#AAC4BA",
    fontSize: 14,
    fontWeight: "600",
  },
});

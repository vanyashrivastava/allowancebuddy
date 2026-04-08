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
import colors from "../theme/colors";

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

// Map positions: left = 0.15, center = 0.5, right = 0.85 (as fraction of width)
const alignX = { left: 0.15, center: 0.5, right: 0.82 };

export default function RewardScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState(lessonStages[0]);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const dogAnim = useRef(new Animated.Value(0)).current;
  const pulseAnims = useRef(lessonStages.map(() => new Animated.Value(1))).current;

  // Pulse animation for current unlocked stage
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnims[currentStage], {
          toValue: 1.18,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnims[currentStage], {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentStage]);

  // Dog hop when stage changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(dogAnim, { toValue: -18, duration: 200, useNativeDriver: true }),
      Animated.timing(dogAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [currentStage]);

  const openLesson = (stage: typeof lessonStages[0]) => {
    if (stage.id > currentStage) return; // locked
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

  // Build connector lines between nodes
  const renderConnectors = () => {
    return lessonStages.slice(0, -1).map((stage, i) => {
      const next = lessonStages[i + 1];
      const x1 = alignX[stage.align as keyof typeof alignX] * width;
      const x2 = alignX[next.align as keyof typeof alignX] * width;
      // Each node is at top of its 110px row, centered in 56px node
      const y1 = i * 110 + 28;
      const y2 = (i + 1) * 110 + 28;
      const done = i < currentStage;
      return (
        <View
          key={`line-${i}`}
          style={[
            styles.connector,
            {
              left: Math.min(x1, x2) - 4,
              top: y1 + 28,
              width: Math.abs(x2 - x1) + 8,
              height: y2 - y1 - 28,
              borderColor: done ? stage.color : "#D9E8E1",
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Lessons</Text>
        <Text style={styles.headerSub}>Follow the bones to the kennel 🐾</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStage / (lessonStages.length - 1)) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {currentStage}/{lessonStages.length - 1} bones found
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.mapContainer,
          { height: lessonStages.length * 110 + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Connector dashed lines */}
        {lessonStages.slice(0, -1).map((stage, i) => {
          const next = lessonStages[i + 1];
          const x1 = alignX[stage.align as keyof typeof alignX] * width;
          const x2 = alignX[next.align as keyof typeof alignX] * width;
          const y1 = i * 110 + 56;
          const y2 = (i + 1) * 110;
          const done = i < currentStage;
          const cx = (x1 + x2) / 2;
          return (
            <View
              key={`conn-${i}`}
              style={[
                styles.dashedLine,
                {
                  left: Math.min(x1, x2) - 2 + 28,
                  top: y1,
                  width: Math.abs(x2 - x1),
                  height: y2 - y1,
                  backgroundColor: "transparent",
                },
              ]}
            >
              {/* Paw prints along path */}
              {[0.3, 0.7].map((frac) => (
                <Text
                  key={frac}
                  style={{
                    position: "absolute",
                    left: frac * Math.abs(x2 - x1) - 8,
                    top: frac * (y2 - y1) - 8,
                    fontSize: 12,
                    opacity: done ? 0.9 : 0.25,
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
          const x = alignX[stage.align as keyof typeof alignX] * width - 28;
          const y = i * 110;
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
                  completed && { backgroundColor: stage.color, borderColor: stage.color },
                  active && {
                    backgroundColor: stage.color,
                    borderColor: stage.color,
                    shadowColor: stage.color,
                    shadowOpacity: 0.55,
                    shadowRadius: 12,
                    elevation: 8,
                  },
                  locked && styles.nodeLocked,
                ]}
              >
                <Text style={[styles.nodeEmoji, locked && { opacity: 0.35 }]}>
                  {completed ? "✅" : locked ? "🔒" : stage.emoji}
                </Text>
              </Pressable>

              {/* Dog marker on active node */}
              {active && (
                <Text style={styles.dogMarker}>🐶</Text>
              )}

              {/* Label */}
              <View
                style={[
                  styles.nodeLabel,
                  stage.align === "right" && styles.nodeLabelRight,
                  stage.align === "center" && styles.nodeLabelCenter,
                ]}
              >
                <Text style={[styles.nodeLabelText, locked && { color: "#AAC4BA" }]}>
                  {stage.title}
                </Text>
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
            <Text style={styles.modalEmoji}>{selectedStage.emoji}</Text>
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

const NODE_SIZE = 56;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F0FAF4",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F4D3F",
  },
  headerSub: {
    fontSize: 13,
    color: "#3C7A6A",
    marginTop: 2,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0F0E8",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#06D6A0",
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: 12,
    color: "#3C7A6A",
    marginTop: 4,
    textAlign: "right",
  },
  mapContainer: {
    position: "relative",
    marginTop: 20,
  },
  dashedLine: {
    position: "absolute",
  },
  connector: {
    position: "absolute",
    borderLeftWidth: 2,
    borderStyle: "solid",
    borderColor: "#D9E8E1",
  },
  nodeWrapper: {
    position: "absolute",
    alignItems: "center",
    width: NODE_SIZE,
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
    backgroundColor: "#EBF5EF",
    borderColor: "#C8DFD1",
  },
  nodeEmoji: {
    fontSize: 26,
  },
  dogMarker: {
    fontSize: 22,
    position: "absolute",
    top: -28,
  },
  nodeLabel: {
    marginTop: 6,
    maxWidth: 90,
  },
  nodeLabelRight: {
    alignItems: "flex-end",
  },
  nodeLabelCenter: {
    alignItems: "center",
  },
  nodeLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F4D3F",
    textAlign: "center",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 5,
    alignItems: "center",
  },
  modalEmoji: {
    fontSize: 52,
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F4D3F",
    textAlign: "center",
  },
  modalSub: {
    fontSize: 13,
    color: "#3C7A6A",
    marginTop: 2,
    marginBottom: 14,
    textAlign: "center",
  },
  modalBody: {
    backgroundColor: "#F0FAF4",
    borderRadius: 14,
    padding: 14,
    width: "100%",
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 15,
    color: "#1F4D3F",
    lineHeight: 23,
    textAlign: "center",
  },
  funFactBox: {
    width: "100%",
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: "#F7FDFB",
    borderRadius: 8,
  },
  funFactText: {
    fontSize: 13,
    color: "#335F53",
    fontStyle: "italic",
    lineHeight: 20,
  },
  modalBtn: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  modalClose: {
    paddingVertical: 6,
  },
  modalCloseText: {
    color: "#AAC4BA",
    fontSize: 14,
    fontWeight: "600",
  },
});

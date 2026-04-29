import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Modal,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ── Landmark nodes — positions as % of screen width/height ─────────
// Tweak xPct/yPct if nodes are slightly off on your device
const landmarks = [
  {
    id: 0,
    name: "Chores Camp",
    emoji: "⛺",
    color: "#F59E0B",
    reward: "5 Bones earned!",
    message: "You showed up and did the work. That's how it starts! 🐾",
    xPct: 0.20,
    yPct: 0.40,
  },
  {
    id: 1,
    name: "Investing Pond",
    emoji: "🪙",
    color: "#3B82F6",
    reward: "10 Bones earned!",
    message: "Your treats are growing in the pond. Magic! 🌊",
    xPct: 0.72,
    yPct: 0.76,
  },
  {
    id: 2,
    name: "Toy Shop",
    emoji: "🧸",
    color: "#EF4444",
    reward: "8 Bones earned!",
    message: "You spent wisely and still had bones left over! 🛍️",
    xPct: 0.47,
    yPct: 0.55,
  },
  {
    id: 3,
    name: "Savings Cave",
    emoji: "🏦",
    color: "#8B5CF6",
    reward: "12 Bones earned!",
    message: "Your savings are safe in the cave. Smart pup! 💰",
    xPct: 0.72,
    yPct: 0.42,
  },
  {
    id: 4,
    name: "Woodland Hut",
    emoji: "🌲",
    color: "#22C55E",
    reward: "15 Bones earned!",
    message: "You made it through the woods. Almost there! 🌿",
    xPct: 0.20,
    yPct: 0.18,
  },
  {
    id: 5,
    name: "Castle Kennel",
    emoji: "🏰",
    color: "#EC4899",
    reward: "20 Bones + Crown! 👑",
    message: "You reached the Castle Kennel! You're a Finance Pup champion! 🎉",
    xPct: 0.50,
    yPct: 0.08,
  },
];

const NODE_SIZE = 56;
const MAP_HEIGHT = height * 0.82;

export default function RewardScreen() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [modalData, setModalData] = useState<typeof landmarks[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnims = useRef(landmarks.map(() => new Animated.Value(1))).current;

  const openModal = (landmark: typeof landmarks[0]) => {
    setModalData(landmark);
    setShowModal(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 7,
    }).start();
  };

  const handleComplete = () => {
    if (modalData && !completed.includes(modalData.id)) {
      const id = modalData.id;
      setCompleted((prev) => [...prev, id]);
      Animated.sequence([
        Animated.timing(bounceAnims[id], { toValue: 1.5, duration: 180, useNativeDriver: true }),
        Animated.spring(bounceAnims[id], { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const isDone = (id: number) => completed.includes(id);

  return (
    <SafeAreaView style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🎁 Rewards</Text>
          <Text style={styles.headerSub}>Tap a stop to collect your bones!</Text>
        </View>
        <View style={styles.bonesPill}>
          <Text style={styles.bonesPillEmoji}>🦴</Text>
          <Text style={styles.bonesPillCount}>{completed.length}</Text>
          <Text style={styles.bonesPillLabel}>/{landmarks.length}</Text>
        </View>
      </View>

      {/* ── Map ── */}
      <ImageBackground
        source={require("../../assets/RewardsBG.png")}
        style={styles.mapBg}
        resizeMode="cover"
      >
        {landmarks.map((lm, i) => {
          const done = isDone(lm.id);
          const nodeLeft = lm.xPct * width - NODE_SIZE / 2;
          const nodeTop = lm.yPct * MAP_HEIGHT - NODE_SIZE / 2;

          return (
            <Animated.View
              key={lm.id}
              style={[
                styles.nodeWrapper,
                { left: nodeLeft, top: nodeTop },
                { transform: [{ scale: bounceAnims[i] }] },
              ]}
            >
              <Pressable
                onPress={() => openModal(lm)}
                style={[
                  styles.node,
                  { borderColor: lm.color },
                  done && { backgroundColor: lm.color },
                ]}
              >
                <Text style={styles.nodeEmoji}>
                  {done ? "✅" : lm.emoji}
                </Text>
              </Pressable>
              <View style={[
                styles.nodeTag,
                { backgroundColor: done ? lm.color : "rgba(255,255,255,0.93)" },
              ]}>
                <Text style={[styles.nodeTagText, done && { color: "#fff" }]}>
                  {lm.name}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </ImageBackground>

      {/* ── Modal ── */}
      <Modal visible={showModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              modalData && { borderTopColor: modalData.color },
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {modalData && (
              <>
                <View style={[styles.iconCircle, { backgroundColor: modalData.color + "22" }]}>
                  <Text style={styles.modalEmoji}>
                    {isDone(modalData.id) ? "✅" : modalData.emoji}
                  </Text>
                </View>

                <Text style={styles.modalTitle}>{modalData.name}</Text>

                {isDone(modalData.id) ? (
                  <>
                    <Text style={styles.alreadyDone}>Already collected! 🎉</Text>
                    <Text style={styles.rewardText}>{modalData.reward}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalMessage}>{modalData.message}</Text>
                    <View style={[styles.rewardBadge, { backgroundColor: modalData.color + "22" }]}>
                      <Text style={[styles.rewardBadgeText, { color: modalData.color }]}>
                        🦴 {modalData.reward}
                      </Text>
                    </View>
                    <Pressable
                      style={[styles.collectBtn, { backgroundColor: modalData.color }]}
                      onPress={handleComplete}
                    >
                      <Text style={styles.collectBtnText}>Collect Reward! 🎉</Text>
                    </Pressable>
                  </>
                )}

                <Pressable style={styles.closeBtn} onPress={closeModal}>
                  <Text style={styles.closeBtnText}>
                    {isDone(modalData.id) ? "Close" : "Maybe later"}
                  </Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1A3D34",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F4D3F",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "#5A9E8A",
    marginTop: 2,
    fontWeight: "600",
  },
  bonesPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FAF4",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "#C8E8D8",
    gap: 4,
  },
  bonesPillEmoji: { fontSize: 18 },
  bonesPillCount: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F4D3F",
  },
  bonesPillLabel: {
    fontSize: 14,
    color: "#5A9E8A",
    fontWeight: "600",
  },

  // Map
  mapBg: {
    flex: 1,
    width: "100%",
    position: "relative",
  },

  // Nodes
  nodeWrapper: {
    position: "absolute",
    alignItems: "center",
    width: NODE_SIZE + 20,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 3.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  nodeEmoji: { fontSize: 26 },
  nodeTag: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 90,
  },
  nodeTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1F4D3F",
    textAlign: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 48,
    borderTopWidth: 5,
    alignItems: "center",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F4D3F",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    color: "#3C7A6A",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  alreadyDone: {
    fontSize: 15,
    color: "#5A9E8A",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  rewardText: {
    fontSize: 15,
    color: "#1F4D3F",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  rewardBadge: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 22,
  },
  rewardBadgeText: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  collectBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  collectBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
  },
  closeBtn: { paddingVertical: 8 },
  closeBtnText: {
    color: "#AAC4BA",
    fontSize: 14,
    fontWeight: "600",
  },
});

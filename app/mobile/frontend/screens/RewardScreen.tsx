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

// 🎯 ALL PURPLE THEME
const PURPLE = "#7C5CBF";

const landmarks = [
  {
    id: 0,
    name: "Chores Camp",
    emoji: "⛺",
    color: "#9B7BFF",
    reward: "5 Bones earned!",
    message: "You showed up and did the work. That's how it starts! 🐾",
    xPct: 0.20,
    yPct: 0.40,
  },
  {
    id: 1,
    name: "Investing Pond",
    emoji: "🪙",
    color: "#6C63FF",
    reward: "10 Bones earned!",
    message: "Your treats are growing in the pond. Magic! 🌊",
    xPct: 0.72,
    yPct: 0.76,
  },
  {
    id: 2,
    name: "Toy Shop",
    emoji: "🧸",
    color: "#B8A9FF",
    reward: "8 Bones earned!",
    message: "You spent wisely and still had bones left over! 🛍️",
    xPct: 0.47,
    yPct: 0.55,
  },
  {
    id: 3,
    name: "Savings Cave",
    emoji: "🏦",
    color: "#8B7CF6",
    reward: "12 Bones earned!",
    message: "Your savings are safe in the cave. Smart pup! 💰",
    xPct: 0.72,
    yPct: 0.42,
  },
  {
    id: 4,
    name: "Woodland Hut",
    emoji: "🌲",
    color: "#A78BFA",
    reward: "15 Bones earned!",
    message: "You made it through the woods. Almost there! 🌿",
    xPct: 0.20,
    yPct: 0.18,
  },
  {
    id: 5,
    name: "Castle Kennel",
    emoji: "🏰",
    color: "#7C5CBF",
    reward: "20 Bones + Crown! 👑",
    message: "You reached the Castle Kennel! 🎉",
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

  const openModal = (lm: any) => {
    setModalData(lm);
    setShowModal(true);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleComplete = () => {
    if (modalData && !completed.includes(modalData.id)) {
      const id = modalData.id;
      setCompleted((prev) => [...prev, id]);
      Animated.sequence([
        Animated.timing(bounceAnims[id], { toValue: 1.4, duration: 150, useNativeDriver: true }),
        Animated.spring(bounceAnims[id], { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
    closeModal();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true })
      .start(() => setShowModal(false));
  };

  const isDone = (id: number) => completed.includes(id);

  return (
    <SafeAreaView style={styles.root}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🎁 Rewards</Text>
          <Text style={styles.headerSub}>Tap a stop to collect your bones!</Text>
        </View>

        <View style={styles.bonesPill}>
          <Text>🦴</Text>
          <Text style={styles.bonesCount}>{completed.length}</Text>
          <Text style={styles.bonesTotal}>/{landmarks.length}</Text>
        </View>
      </View>

      {/* MAP */}
      <ImageBackground
        source={require("../../assets/RewardsBG.png")}
        style={styles.mapBg}
        resizeMode="cover"
      >

        {/* GOLD OVERLAY */}
        <View style={styles.overlay} />

        {landmarks.map((lm, i) => {
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
                  isDone(lm.id) && styles.nodeDone,
                ]}
              >
                <Text style={styles.nodeEmoji}>
                  {isDone(lm.id) ? "✅" : lm.emoji}
                </Text>
              </Pressable>

              <View style={styles.nodeTag}>
                <Text style={styles.nodeTagText}>{lm.name}</Text>
              </View>
            </Animated.View>
          );
        })}
      </ImageBackground>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
            {modalData && (
              <>
                <Text style={styles.modalEmoji}>{modalData.emoji}</Text>
                <Text style={styles.modalTitle}>{modalData.name}</Text>

                {isDone(modalData.id) ? (
                  <Text style={styles.doneText}>Already collected 🎉</Text>
                ) : (
                  <>
                    <Text style={styles.modalMsg}>{modalData.message}</Text>

                    <Pressable style={styles.collectBtn} onPress={handleComplete}>
                      <Text style={styles.collectText}>Collect Reward</Text>
                    </Pressable>
                  </>
                )}

                <Pressable onPress={closeModal}>
                  <Text style={styles.closeText}>Close</Text>
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
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#4C3DB2",
  },

  headerSub: {
    color: "#7C6AE6",
    fontSize: 12,
  },

  bonesPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    borderColor: "#D6CCFF",
    borderWidth: 1,
  },

  bonesCount: { fontWeight: "800", color: "#4C3DB2" },
  bonesTotal: { color: "#7C6AE6" },

  mapBg: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,200,120,0.08)",
  },

  nodeWrapper: { position: "absolute", alignItems: "center" },

  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: 28,
    backgroundColor: "rgba(124,92,191,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  nodeDone: {
    backgroundColor: "rgba(124,92,191,0.3)",
  },

  nodeEmoji: { fontSize: 26 },

  nodeTag: {
    marginTop: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  nodeTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4C3DB2",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: "center",
  },

  modalEmoji: { fontSize: 40 },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4C3DB2",
  },

  modalMsg: { textAlign: "center", marginVertical: 10 },

  collectBtn: {
    backgroundColor: PURPLE,
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },

  collectText: { color: "#fff", fontWeight: "800" },

  closeText: { marginTop: 10, color: "#aaa" },

  doneText: { marginVertical: 10 },
});
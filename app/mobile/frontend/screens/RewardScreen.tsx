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

const PURPLE = "#7C5CBF";

const landmarks = [
  { id: 0, name: "Chores Camp", emoji: "⛺", xPct: 0.20, yPct: 0.40 },
  { id: 1, name: "Investing Pond", emoji: "🪙", xPct: 0.72, yPct: 0.76 },
  { id: 2, name: "Toy Shop", emoji: "🧸", xPct: 0.47, yPct: 0.55 },
  { id: 3, name: "Savings Cave", emoji: "🏦", xPct: 0.72, yPct: 0.42 },
  { id: 4, name: "Woodland Hut", emoji: "🌲", xPct: 0.20, yPct: 0.18 },
  { id: 5, name: "Castle Kennel", emoji: "🏰", xPct: 0.50, yPct: 0.08 },

  // ✅ FIXED missing node
  { id: 6, name: "Deluxe Doghouse", emoji: "🏡", xPct: 0.78, yPct: 0.22 },
];

const NODE_SIZE = 60;
const MAP_HEIGHT = height * 0.82;

export default function RewardScreen() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [modalData, setModalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnims = useRef(landmarks.map(() => new Animated.Value(1))).current;
  const glowAnims = useRef(landmarks.map(() => new Animated.Value(1))).current;

  const openModal = (lm: any) => {
    setModalData(lm);
    setShowModal(true);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleComplete = () => {
    if (modalData && !completed.includes(modalData.id)) {
      const id = modalData.id;
      setCompleted((prev) => [...prev, id]);
      setProgress((p) => p + 1);

      // bounce
      Animated.sequence([
        Animated.timing(bounceAnims[id], { toValue: 1.5, duration: 150, useNativeDriver: true }),
        Animated.spring(bounceAnims[id], { toValue: 1, useNativeDriver: true }),
      ]).start();

      // glow loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnims[id], { toValue: 1.2, duration: 600, useNativeDriver: true }),
          Animated.timing(glowAnims[id], { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
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
          <Text style={styles.headerSub}>Tap to collect your bones!</Text>
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

        {/* CURVED PATH */}
        {landmarks.map((lm, i) => {
          if (i === 0) return null;

          const prev = landmarks[i - 1];

          const x1 = prev.xPct * width;
          const y1 = prev.yPct * MAP_HEIGHT;

          const x2 = lm.xPct * width;
          const y2 = lm.yPct * MAP_HEIGHT;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 60;

          const dots = 10;

          return Array.from({ length: dots }).map((_, j) => {
            const t = j / dots;

            const x =
              (1 - t) * (1 - t) * x1 +
              2 * (1 - t) * t * midX +
              t * t * x2;

            const y =
              (1 - t) * (1 - t) * y1 +
              2 * (1 - t) * t * midY +
              t * t * y2;

            const visible = i <= progress;

            return (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.pathDot,
                  {
                    left: x,
                    top: y,
                    opacity: visible ? 1 : 0.2,
                  },
                ]}
              />
            );
          });
        })}

        {/* NODES */}
        {landmarks.map((lm, i) => {
          const left = lm.xPct * width - NODE_SIZE / 2;
          const top = lm.yPct * MAP_HEIGHT - NODE_SIZE / 2;

          return (
            <Animated.View
              key={lm.id}
              style={[
                styles.nodeWrapper,
                { left, top },
                {
                  transform: [
                    { scale: bounceAnims[i] },
                    { scale: isDone(lm.id) ? glowAnims[i] : 1 }, // ✅ FIXED
                  ],
                },
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

              <Text style={styles.nodeLabel}>{lm.name}</Text>
            </Animated.View>
          );
        })}
      </ImageBackground>

      {/* MODAL */}
      <Modal visible={showModal} transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
            {modalData && (
              <>
                <Text style={styles.modalEmoji}>{modalData.emoji}</Text>
                <Text style={styles.modalTitle}>{modalData.name}</Text>

                {isDone(modalData.id) ? (
                  <Text style={styles.doneText}>Already collected 🎉</Text>
                ) : (
                  <Pressable style={styles.collectBtn} onPress={handleComplete}>
                    <Text style={styles.collectText}>Collect Reward</Text>
                  </Pressable>
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

// ───── STYLES ─────

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(124,92,191,0.15)",
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

  nodeWrapper: {
    position: "absolute",
    alignItems: "center",
  },

  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: "rgba(124,92,191,0.12)",
    borderWidth: 2,
    borderColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  nodeDone: {
    backgroundColor: "rgba(124,92,191,0.3)",
    shadowColor: PURPLE,
    shadowOpacity: 0.9,
    shadowRadius: 15,
  },

  nodeEmoji: { fontSize: 26 },

  nodeLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "800",
    color: "#4C3DB2",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    borderRadius: 8,
  },

  pathDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PURPLE,
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
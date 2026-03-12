import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ChildHomeScreen from "./screens/ChildHomeScreen";
import ParentDashboardScreen from "./screens/ParentDashboardScreen";
import RewardsScreen from "./screens/RewardsScreen";
import { ScreenName } from "./types";

// Minimal tab-like navigation so the three starter wireframes are easy to preview.
const tabs: ScreenName[] = ["ChildHome", "ParentDashboard", "Rewards"];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>("ChildHome");

  const renderScreen = () => {
    if (activeScreen === "ChildHome") {
      return <ChildHomeScreen />;
    }

    if (activeScreen === "ParentDashboard") {
      return <ParentDashboardScreen />;
    }

    return <RewardsScreen />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveScreen(tab)}
            style={[styles.tabButton, activeScreen === tab && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeScreen === tab && styles.activeTabText]}>
              {tab === "ChildHome" ? "Child" : tab === "ParentDashboard" ? "Parent" : "Rewards"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.screenWrap}>{renderScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#EEF3F8",
    padding: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E1EA",
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7E1EB",
  },
  activeTabButton: {
    backgroundColor: "#D5E8FF",
    borderColor: "#9CC4F3",
  },
  tabText: {
    color: "#35506B",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#153D66",
    fontWeight: "800",
  },
  screenWrap: {
    flex: 1,
  },
});

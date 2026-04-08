// Main navigation setup using React Navigation bottom tabs.
// Each tab maps to one of the three starter screens.

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ChildHomeScreen from "../screens/ChildHomeScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";
import RewardsScreen from "../screens/RewardScreen";
import LessonsScreen from "../screens/LessonsScreen";
import colors from "../theme/colors";

// Define the param list so TypeScript knows our routes
export type RootTabParamList = {
  Child: undefined;
  Parent: undefined;
  Rewards: undefined;
  Lessons: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.tabBarBg,
            borderTopColor: colors.tabBarBorder,
          },
        }}
      >
        <Tab.Screen name="Child" component={ChildHomeScreen} />
        <Tab.Screen name="Parent" component={ParentDashboardScreen} />
        <Tab.Screen name="Rewards" component={RewardsScreen} />
        <Tab.Screen name="Lessons" component={LessonsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

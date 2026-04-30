// Main navigation setup using React Navigation bottom tabs.

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native";

import ChildHomeScreen from "../screens/ChildHomeScreen";
import ParentDashboardScreen from "../screens/ParentDashboardScreen";
import RewardsScreen from "../screens/RewardScreen";
import LessonsScreen from "../screens/LessonsScreen";
import TeacherScreen from "../screens/TeachersScreen";

import colors from "../theme/colors";

// Define routes
export type RootTabParamList = {
  Child: undefined;
  Parent: undefined;
  Rewards: undefined;
  Lessons: undefined;
  Teacher: undefined;
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

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        {/* CHILD */}
        <Tab.Screen
          name="Child"
          component={ChildHomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🏠</Text>
            ),
          }}
        />

        {/* PARENT */}
        <Tab.Screen
          name="Parent"
          component={ParentDashboardScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>👨‍👩‍👧</Text>
            ),
          }}
        />

        {/* REWARDS */}
        <Tab.Screen
          name="Rewards"
          component={RewardsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🎁</Text>
            ),
          }}
        />

        {/* LESSONS */}
        <Tab.Screen
          name="Lessons"
          component={LessonsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>📚</Text>
            ),
          }}
        />

        {/* TEACHER */}
        <Tab.Screen
          name="Teacher"
          component={TeacherScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>🎓</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
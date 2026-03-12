// App entry point — renders the tab navigation.
import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigation from "./frontend/navigation";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AppNavigation />
    </>
  );
}

import React from "react";
import { ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";

function TabsView({ children }: { children: React.ReactNode }) {
  return (
    <ThemedView style={{ ...styles.container, ...styles.content }}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});

export default TabsView;

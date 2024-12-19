import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScanActivityLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default ScanActivityLayout;

const styles = StyleSheet.create({});

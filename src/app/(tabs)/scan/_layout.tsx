import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ScanLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='image' options={{ headerShown: false }} />
      <Stack.Screen name='leakage' options={{ headerShown: false }} />
      <Stack.Screen
        name='leakage-submit'
        options={{
          title: "Submit Leakage Details",
        }}
      />
    </Stack>
  );
};

export default ScanLayout;

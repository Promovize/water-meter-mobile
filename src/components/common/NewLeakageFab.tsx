import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FAB } from "react-native-paper";
import chroma from "chroma-js";
import { defaultColors } from "../theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

type Props = {
  onPress?: () => void;
};

const NewLeakageFab = (props: Props) => {
  const router = useRouter();

  const handlePress = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const image = result.assets[0].uri;

        router.push({
          pathname: "/(tabs)/scan/leakage-submit",
          params: {
            imageUri: image,
          },
        });
      }
    } catch (error) {
      console.log;
    }
  };
  return (
    <FAB
      icon={({ color, size }) => (
        <AntDesign name="warning" color={color} size={size} />
      )}
      color={defaultColors.white}
      style={styles.fab}
      onPress={handlePress}
    />
  );
};

export default NewLeakageFab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 120,
    backgroundColor: defaultColors.primary,
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FAB } from "react-native-paper";
import chroma from "chroma-js";
import { defaultColors } from "../theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  onPress: () => void;
};

const NewLeakageFab = (props: Props) => {
  const { onPress } = props;

  return (
    <FAB
      icon={({ color, size }) => <AntDesign name='warning' color={color} size={size} />}
      color={defaultColors.white}
      style={styles.fab}
      onPress={onPress}
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

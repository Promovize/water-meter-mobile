import { StyleSheet, View } from "react-native";
import React from "react";
import { defaultColors } from "../theme/colors";
import chroma from "chroma-js";

const ListItemSeparator = () => {
  return <View style={styles.container} />;
};

export default ListItemSeparator;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 1,
    backgroundColor: chroma(defaultColors.black).alpha(0.09).hex(),
  },
});

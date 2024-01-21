import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

const CameraFooter = () => {
  return (
    <View style={styles.container}>
      <Text>CameraFooter</Text>
    </View>
  );
};

export default CameraFooter;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    color: "white",
    backgroundColor: "black",
  },
});

import { StyleSheet, View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

const LoadingContainer = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' style={styles.indicator} />
    </View>
  );
};

export default LoadingContainer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  indicator: {
    flex: 1,
    alignSelf: "center",
  },
});

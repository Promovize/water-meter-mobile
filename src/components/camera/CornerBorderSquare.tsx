import { StyleSheet, View } from "react-native";
import { defaultColors } from "../theme/colors";

const CornerBorderSquare = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 300,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderColor: defaultColors.white,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderColor: defaultColors.white,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderColor: defaultColors.white,
    borderWidth: 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderColor: defaultColors.white,
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
});

export default CornerBorderSquare;

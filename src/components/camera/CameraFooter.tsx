import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { triggerMediumImpact } from "@/utils/haptics";

type Props = {
  onTakePicture: () => void;
};

const CameraFooter = (props: Props) => {
  const { onTakePicture } = props;

  const handleTakePicture = () => {
    triggerMediumImpact();
    onTakePicture();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.shooterOuterCircle} onPress={handleTakePicture}>
        <View style={styles.shooterInnerCircle} />
      </TouchableOpacity>
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
  },
  shooterOuterCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    bottom: 15,
  },

  shooterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "white",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "black",
  },
});

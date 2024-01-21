import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CamaraHeader from "@/components/camera/CamaraHeader";
import CameraFooter from "@/components/camera/CameraFooter";

const ScanScreen = () => {
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(false); // [1
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const insets = useSafeAreaInsets();

  const toggleCameraType = () => {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  const paddingTop = insets.top + 20;

  if (permission?.granted === undefined) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop,
          },
        ]}
      >
        <Text>Requesting permission...</Text>
      </View>
    );
  }

  if (permission?.granted === false) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop,
          },
        ]}
      >
        <Text>No access to camera</Text>
        <Button mode='contained' onPress={requestPermission}>
          Request Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[
          styles.camera,
          {
            paddingTop,
          },
        ]}
        type={type}
        flashMode={flash ? FlashMode.torch : FlashMode.off}
      >
        <CamaraHeader flashOn={flash} toggleFlash={toggleFlash} />
        <CameraFooter />
      </Camera>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
});

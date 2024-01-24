import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AutoFocus, Camera, CameraType, FlashMode } from "expo-camera";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CamaraHeader from "@/components/camera/CamaraHeader";
import CameraFooter from "@/components/camera/CameraFooter";
import CornerBorderSquare from "@/components/camera/CornerBorderSquare";
import { useRouter } from "expo-router";

const ScanScreen = () => {
  const [flash, setFlash] = useState(false); // [1
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const insets = useSafeAreaInsets();
  const cameraRef = React.useRef<Camera>(null);
  const router = useRouter();

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  const handleTakePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
    });

    router.push({
      pathname: "/(tabs)/scan/image",
      params: {
        imageUri: photo?.uri!,
      },
    });
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
        type={CameraType.back}
        ref={cameraRef}
        flashMode={flash ? FlashMode.on : FlashMode.off}
        autoFocus={AutoFocus.on}
      >
        <CamaraHeader flashOn={flash} toggleFlash={toggleFlash} />
        <CornerBorderSquare />
        <CameraFooter onTakePicture={handleTakePicture} />
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
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
});

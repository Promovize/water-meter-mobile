import { StyleSheet, View } from "react-native";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

type RootStackParamList = {
  Image: { imageUri: string };
};

type ImageScreenRouteProp = RouteProp<RootStackParamList, "Image">;

const ImageScreen = () => {
  const route = useRoute<ImageScreenRouteProp>();
  const router = useRouter();
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant='titleLarge' style={styles.title}>
          Image Processing
        </Text>
      </View>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.buttonsWrapper}>
        <Button mode='contained' onPress={() => router.back()} style={styles.button}>
          Retake
        </Button>
        <Button mode='contained' onPress={() => {}} style={styles.button}>
          Next
        </Button>
      </View>
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
  button: {
    flex: 1,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
  },
});

import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  flashOn: boolean;
  toggleFlash: () => void;
};

const CamaraHeader = (props: Props) => {
  const { flashOn, toggleFlash } = props;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name='close' size={30} color='white' />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleFlash}>
        <Ionicons name={flashOn ? "flash" : "flash-off"} size={30} color='white' />
      </TouchableOpacity>
    </View>
  );
};

export default CamaraHeader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

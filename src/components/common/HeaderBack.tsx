import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

type Props = {
  color?: string;
};

const HeaderBack = (props: Props) => {
  const { color } = props;
  const router = useRouter();

  if (!router.canGoBack()) return null;

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.container}>
      <AntDesign name='arrowleft' size={24} color={color || "black"} />
    </TouchableOpacity>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 5,
  },
});

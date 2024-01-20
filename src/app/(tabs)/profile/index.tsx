import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Route } from "@/constants/Route";
import chroma from "chroma-js";
import { defaultColors } from "@/components/theme/colors";

const ProfileScreen = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error logging out", error.message);
    } else {
      router.push(Route.Welcome);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentHeader}></View>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentHeader: {
    alignItems: "center",
    height: "20%",
    // lightens the primary color by 0.5
    backgroundColor: chroma(defaultColors.primary).brighten(2).hex(),
  },
});

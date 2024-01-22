import { defaultColors } from "@/components/theme/colors";
import { boxShaddow } from "@/utils/styles";
import chroma from "chroma-js";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { useAuth } from "@/contexts/AuthProvider";

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const cardNumber = "1234 5678 9012 3456";

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../assets/images/card-bg.jpeg")} style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={require("../../assets/images/Visa.png")} style={styles.visaLogo} resizeMode='contain' />
          <Text variant='titleSmall' style={styles.solde}>
            <Text variant='titleSmall' style={styles.currency}>
              FRW
            </Text>{" "}
            1.000.000
          </Text>
        </View>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
        </View>
        <Text variant='titleSmall' style={styles.names}>
          {user?.full_name}
        </Text>
      </ImageBackground>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  card: {
    width: "100%",
    padding: 20,
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
    ...boxShaddow,
    position: "relative",
  },
  visaLogo: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  solde: {
    color: defaultColors.white,
    fontWeight: "bold",
  },
  currency: {
    fontWeight: "bold",
    color: defaultColors.white,
  },

  cardNumber: {
    color: defaultColors.white,
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 2,
    fontStyle: "italic",
  },
  cardNumberContainer: {
    marginTop: 35,
  },
  names: {
    position: "absolute",
    bottom: 20,
    right: 20,
    color: defaultColors.white,
  },
});

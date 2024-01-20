import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";

const WelcomeScreen = () => {
  const { colors } = useTheme();

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoWrapper}>
          <Image source={require("@/assets/images/logo.png")} style={{ width: 200, height: 200 }} />
        </View>
        <View style={styles.heroText}>
          <Text variant='headlineLarge' style={styles.welcomeText}>
            Welcome to AquaIntel
          </Text>
          <Text variant='bodyMedium' style={styles.welcomeTextBody}>
            Effortlessly monitor your water usage. Simple, smart, and sustainable. AquaIntel - every drop counts."
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button mode='contained' onPress={() => router.push("/login/")}>
            Get Started
          </Button>
        </View>
      </View>
      <View style={styles.poweredBy}>
        <Text variant='bodyMedium' style={styles.poweredByText}>
          Powered by
        </Text>
        <Link href='https://promovize.dev'>
          <Text
            variant='bodyMedium'
            style={[
              {
                color: colors.primary,
                fontWeight: "bold",
              },
            ]}
          >
            Promovize
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // change this color and opacity as needed
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "center",
    gap: 30,
  },
  heroText: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonWrapper: {},
  welcomeText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  welcomeTextBody: {
    textAlign: "center",
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  poweredBy: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    gap: 5,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  poweredByText: {},
});

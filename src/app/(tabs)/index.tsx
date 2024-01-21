import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant='titleLarge' style={{ textAlign: "center" }}>
        Welcome to the home page
      </Text>
      <Button mode='contained' onPress={() => router.push("/(tabs)/scan")}>
        Scan Your Water Meter
      </Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

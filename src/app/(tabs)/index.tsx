import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text variant='displayMedium'>Welcome to the home page</Text>
    </View>
  );
}

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

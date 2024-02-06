import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import useSWR from "swr";
import { getSingleLeakage } from "@/api/userFetcher";
import MapView, { Marker } from "react-native-maps";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { parseLocation } from "./list";

const LeakageDetails = () => {
  const route = useRoute<any>();
  const { id } = route.params;
  const router = useRouter();

  const {
    data: leakage,
    error,
    isLoading,
  } = useSWR(`/leackage/${id}`, () => getSingleLeakage(id));

  if (error) {
    Alert.alert("Error fetching leakage", error.message);
    router.back();
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const coordinates = parseLocation(leakage?.location);
  const { coords } = coordinates || {};

  if (!coords)
    return (
      <View>
        <Text>Invalid coordinates</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.pressedDataWrapper}>
        <Image
          source={{ uri: leakage?.leakage_image_url }}
          style={styles.image}
        />
      </View>
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coords?.latitude,
            longitude: coords?.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          mapType="hybrid"
        >
          <Marker
            coordinate={{
              latitude: coords?.latitude,
              longitude: coords?.longitude,
            }}
            title="Leakage"
            description="This is the location of the leakage"
          />
        </MapView>
      </View>
    </View>
  );
};

export default LeakageDetails;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
  },
  map: {
    width: "100%",
    height: 450,
    // flex: 1,
  },
  pressedDataWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
});

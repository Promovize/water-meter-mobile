import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import { decode } from "base-64";
import * as FileSystem from "expo-file-system";
import { baseUrl } from "@/utils/constants";
import axios from "axios";

type RootStackParamList = {
  Image: { imageUri: string };
};

type ImageScreenRouteProp = RouteProp<RootStackParamList, "Image">;

const LeakageSubmitScreen = () => {
  const route = useRoute<ImageScreenRouteProp>();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [sending, setSending] = useState<boolean>(false);
  const router = useRouter();
  const { user, session } = useAuth();
  const token = session?.access_token;

  const { imageUri } = route.params;

  useEffect(() => {
    handleRequestPermission();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const handleRequestPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location as any);
  };

  const handleSendLocation = async () => {
    try {
      setSending(true);

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      if (location) {
        formData.append("location", JSON.stringify(location));
      }

      await axios.post(`${baseUrl}/leakage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSending(false);
      Alert.alert("Success", "Your report has been sent");
      router.push("/(tabs)/");
    } catch (error: any) {
      setSending(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {errorMsg && (
        <Button onPress={handleRequestPermission}>
          Please allow location permission
        </Button>
      )}
      <View style={styles.header}>
        <Button mode="contained" onPress={handleSendLocation} loading={sending}>
          Send current location
        </Button>
      </View>
      <MapView
        style={styles.map}
        mapType="hybrid"
        initialRegion={{
          latitude: location?.coords.latitude!,
          longitude: location?.coords.longitude!,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location?.coords.latitude!,
            longitude: location?.coords.longitude!,
          }}
          title="Leakage"
          description="Current location of the leakage"
        />
      </MapView>
    </View>
  );
};

export default LeakageSubmitScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  map: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 20,
  },
});

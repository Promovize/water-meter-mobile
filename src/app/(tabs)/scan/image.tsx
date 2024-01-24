import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthProvider";
import axios from "axios";
import { getErrorMessage } from "@/utils/errorHandler";
import { boxShaddow } from "@/utils/styles";
import { defaultColors } from "@/components/theme/colors";

enum Status {
  Blurry = "BLURRY",
  NoMeter = "NO_METER",
  NoMeterDetails = "NO_METER_DETAILS",
  Success = "SUCCESS",
}

type RootStackParamList = {
  Image: { imageUri: string };
};

type ImageScreenRouteProp = RouteProp<RootStackParamList, "Image">;

const ImageScreen = () => {
  const route = useRoute<ImageScreenRouteProp>();
  const router = useRouter();
  const [processing, setProcessing] = React.useState(false);
  const [result, setResult] = React.useState<null>(null);
  const [paying, setPaying] = React.useState(false);
  const { imageUri } = route.params;

  const { session } = useAuth();
  const token = session?.access_token;
  const url = "https://wltthetqeqixvwuvldaf.supabase.co/functions/v1/send-image-to-openai";

  const uploadImageForProcessing = async () => {
    try {
      setProcessing(true);

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const { data } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(Array.isArray(data) ? data[0]["0"] : data);
      setProcessing(false);
      Alert.alert("Image uploaded and processed successfully");
    } catch (error: any) {
      Alert.alert("Error uploading image", getErrorMessage(error));
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    setTimeout(() => {
      Alert.alert("Payment successful");
      setPaying(false);
      router.push("/(tabs)/activities/");
    }, 1000);
  };
  const receivedData: any = result?.["0"] ? result?.["0"] : result;
  const meter = (result as any)?.meter;

  const statusToColor = (status: Status) => {
    switch (status) {
      case Status.Blurry:
        return defaultColors.error;
      case Status.NoMeter:
        return defaultColors.error;
      case Status.NoMeterDetails:
        return defaultColors.error;
      case Status.Success:
        return defaultColors.success;
    }
  };
  const statusToText = (status: Status) => {
    switch (status) {
      case Status.Blurry:
        return "Blurry";
      case Status.NoMeter:
        return "No Meter visible";
      case Status.NoMeterDetails:
        return "No Meter Details";
      case Status.Success:
        return "Success";
    }
  };

  const canPay = receivedData?.status === "SUCCESS";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant='titleLarge' style={styles.title}>
          Image Processing
        </Text>
      </View>
      <Image source={{ uri: imageUri }} style={styles.image} />
      {!receivedData && (
        <View style={styles.buttonsWrapper}>
          <Button mode='contained' onPress={() => router.back()} style={styles.button} disabled={processing}>
            Retake
          </Button>
          <Button mode='contained' onPress={uploadImageForProcessing} style={styles.button} loading={processing}>
            Next
          </Button>
        </View>
      )}
      <View style={styles.processingWrapper}>{processing && <Text>Processing the image, please wait...</Text>}</View>

      {receivedData && canPay && <Text style={styles.duePayment}>Due payment: RWF 2000</Text>}
      {receivedData && (
        <View style={styles.pressedDataWrapper}>
          <View style={styles.pressedData}>
            <Text variant='titleMedium'>Meter Number:</Text>
            <Text>{meter?.name || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant='titleMedium'>Meter Reading:</Text>
            <Text>{receivedData?.meter_reading || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant='titleMedium'>Meter Type:</Text>
            <Text>{receivedData?.meter_type || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant='titleMedium'>Meter status:</Text>
            <Text
              style={{
                color: statusToColor(receivedData?.status),
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {statusToText(receivedData?.status) || "-"}
            </Text>
          </View>
        </View>
      )}

      {receivedData && (
        <View style={styles.buttonsWrapper}>
          <Button mode='contained' onPress={() => router.back()}>
            Cancel
          </Button>
          {canPay && (
            <Button onPress={handlePayment} mode='contained' loading={paying}>
              Proceed to payment
            </Button>
          )}
        </View>
      )}
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
  processingWrapper: {
    marginTop: 20,
  },

  pressedDataWrapper: {
    marginTop: 20,
    gap: 20,
    padding: 20,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    ...boxShaddow,
  },

  pressedData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  duePayment: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: defaultColors.error,
  },
});

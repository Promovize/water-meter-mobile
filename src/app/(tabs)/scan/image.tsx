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
import { Screen } from "@/components/Screen";
import useSWR from "swr";
import { getHistory } from "@/api/userFetcher";
import { supabase } from "@/lib/supabase";

const baseUrl =
  process.env.BASE_URL || "https://water-meter-api.up.railway.app/api";

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
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = React.useState(false);
  const [result, setResult] = React.useState<null>(null);
  const [paying, setPaying] = React.useState(false);
  const { imageUri } = route.params;
  const { data: scansHistory = [], mutate } = useSWR(
    user ? "history" : null,
    () => getHistory(user?.id as string)
  );

  const { session } = useAuth();
  const token = session?.access_token;

  const uploadImageForProcessing = async () => {
    const url = `${baseUrl}/upload`;
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

      mutate();
      setResult(data);
      setProcessing(false);
      Alert.alert("Image uploaded and processed successfully");
    } catch (error: any) {
      console.log({ error });
      Alert.alert("Error uploading image", getErrorMessage(error));
      setProcessing(false);
    }
  };

  type PaymentData = {
    amount: number;
    meter_id: string;
    scan_id: string;
  };

  const handlePayment = async (data: PaymentData) => {
    const { scan_id } = data;
    setPaying(true);
    try {
      const url = `${baseUrl}/pay`;
      await axios.post(
        url,
        { scan_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      mutate();
      supabase.auth.refreshSession();
      Alert.alert("Payment successful");
      router.push("/(tabs)/activities");
    } catch (error) {
      Alert.alert("Error paying", getErrorMessage(error));
    } finally {
      setPaying(false);
    }
  };

  const receivedData: any = result;
  const meter = (receivedData as any)?.meter_numbers;

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

  const canPay =
    receivedData?.status === "SUCCESS" &&
    !receivedData?.is_paid &&
    receivedData?.amount > 0 &&
    receivedData.meter_number_id;
  const isInitalScan = scansHistory.length === 0;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Image Processing
          </Text>
        </View>
        <Image source={{ uri: imageUri }} style={styles.image} />
        {!receivedData && (
          <View style={styles.buttonsWrapper}>
            <Button
              mode="contained"
              onPress={() => router.back()}
              style={styles.button}
              disabled={processing}
            >
              Retake
            </Button>
            <Button
              mode="contained"
              onPress={uploadImageForProcessing}
              style={styles.button}
              loading={processing}
            >
              Next
            </Button>
          </View>
        )}
        <View style={styles.processingWrapper}>
          {processing && (
            <Text variant="titleMedium">
              Processing the image, please wait...
            </Text>
          )}
        </View>

        {receivedData && (
          <Text style={styles.duePayment}>
            Due payment: RWF {receivedData?.amount}
          </Text>
        )}

        {receivedData && (
          <View style={styles.pressedDataWrapper}>
            <View style={styles.pressedData}>
              <Text variant="titleMedium" style={styles.key}>
                Meter Number:
              </Text>
              <Text>{meter?.name || receivedData?.actual_meter_number}</Text>
            </View>
            <View style={styles.pressedData}>
              <Text variant="titleMedium" style={styles.key}>
                Meter Reading:
              </Text>
              <Text>{receivedData?.meter_reading || "-"}</Text>
            </View>
            <View style={styles.pressedData}>
              <Text variant="titleMedium" style={styles.key}>
                Meter Type:
              </Text>
              <Text>{receivedData?.meter_type || "-"}</Text>
            </View>
            <View style={styles.pressedData}>
              <Text variant="titleMedium" style={styles.key}>
                Meter status:
              </Text>
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
            <Button mode="contained" onPress={() => router.back()}>
              Cancel
            </Button>
            {canPay && !isInitalScan && (
              <Button
                onPress={() => {
                  Alert.alert(
                    "Confirm Payment",
                    `Are you sure you want to proceed with the payment of FRW ${receivedData?.amount}?`,
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Confirm",
                        onPress: () =>
                          handlePayment({
                            amount: receivedData?.amount,
                            meter_id: receivedData?.meter_number_id,
                            scan_id: receivedData?.id,
                          }),
                      },
                    ]
                  );
                }}
                mode="contained"
                loading={paying}
              >
                Proceed to payment
              </Button>
            )}
            {isInitalScan && (
              <Button
                onPress={() => router.push("/(tabs)/activities/")}
                mode="contained"
              >
                Go to history
              </Button>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  key: {
    fontWeight: "bold",
    fontSize: 16,
    width: 150,
  },
});

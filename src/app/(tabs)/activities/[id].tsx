import { Alert, StyleSheet, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "expo-router";
import useSWR from "swr";
import { getHistory } from "@/api/userFetcher";
import { defaultColors } from "@/components/theme/colors";
import { boxShaddow } from "@/utils/styles";
import { Text } from "react-native-paper";
import { statusToColor, statusToText } from ".";

const ScanDetails = () => {
  const route = useRoute<any>();
  const { id } = route.params;
  const { user } = useAuth();
  const router = useRouter();
  const { data: scansHistory, isLoading } = useSWR(
    user ? "history" : null,
    () => getHistory(user?.id as string)
  );
  const currentScan = scansHistory?.find((scan: any) => scan.id === id);

  if (!isLoading && !currentScan) {
    Alert.alert("Scan not found");
    router.push("/(tabs)/activities");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScanDetails</Text>
      <View>
        <View style={styles.pressedDataWrapper}>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Meter Number:
            </Text>
            <Text>{currentScan.meter_numbers?.name || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Meter Reading:
            </Text>
            <Text>{currentScan?.meter_reading || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Meter Type:
            </Text>
            <Text>{currentScan?.meter_type || "-"}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Meter status:
            </Text>
            <Text
              style={{
                color: statusToColor(currentScan?.status),
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {statusToText(currentScan?.status) || "-"}
            </Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Due Payment:
            </Text>
            <Text
              style={{
                color: defaultColors.error,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              FRW {currentScan?.amount}
            </Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Unit:
            </Text>
            <Text>{currentScan?.meter_reading_unit}</Text>
          </View>
          <View style={styles.pressedData}>
            <Text variant="titleMedium" style={styles.key}>
              Payment Status:
            </Text>
            <Text
              style={{
                color: currentScan.is_paid
                  ? defaultColors.success
                  : defaultColors.error,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {currentScan.is_paid ? "Paid" : "Not paid"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScanDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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

import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import ListItemSeparator from "@/components/common/ListItemSeparator";
import ListItem from "@/components/common/ListItem";
import { defaultColors } from "@/components/theme/colors";
import { getHistory } from "@/api/userFetcher";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "expo-router";

export enum Status {
  Blurry = "BLURRY",
  NoMeter = "NO_METER",
  NoMeterDetails = "NO_METER_DETAILS",
  Success = "SUCCESS",
}

export const statusToIcon = (status: Status) => {
  switch (status) {
    case Status.Blurry:
      return "eye-slash";
    case Status.NoMeter:
      return "exclamation-triangle";
    case Status.NoMeterDetails:
      return "exclamation-triangle";
    case Status.Success:
      return "check";
  }
};

export const statusToColor = (status: Status) => {
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

export const statusToText = (status: Status) => {
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

export const convertMeterNumber = (meterNumber: string) => {
  const firstTwo = meterNumber.slice(0, 4);
  const lastTwo = meterNumber.slice(-4);
  const converted = `${firstTwo}...${lastTwo}`;
  return converted;
};

const ActivitiesScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const {
    data: scansHistory,
    mutate,
    error,
    isValidating,
  } = useSWR(user ? "history" : null, () => getHistory(user?.id as string));
  const isLoading = !scansHistory && !error;

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={styles.historyTitle}>
        History
      </Text>
      <FlatList
        data={scansHistory || []}
        ItemSeparatorComponent={ListItemSeparator}
        keyExtractor={(item) => item.id}
        onRefresh={mutate}
        refreshing={isLoading || isValidating}
        style={styles.history}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <ListItem
              date={item.created_at}
              onPress={() => router.push(`/(tabs)/activities/${item.id}`)}
              status={
                <View style={styles.paymentStatus}>
                  <Text
                    style={{
                      color: item.is_paid
                        ? defaultColors.success
                        : defaultColors.error,
                    }}
                  >
                    {item.is_paid ? "Paid" : "Not Paid"}
                  </Text>
                </View>
              }
              title={`Meter No ${
                convertMeterNumber(item.meter_numbers?.name || "") || "-"
              } `}
              subtitle={item.meter_numbers?.name ? `FRW ${item.amount}` : "-"}
              icon={statusToIcon(item.status as Status)}
            />
          );
        }}
      />
    </View>
  );
};

export default ActivitiesScreen;

const styles = StyleSheet.create({
  history: {
    width: "100%",
  },
  historyTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  historyList: {
    width: "100%",
    backgroundColor: "orange",
  },
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 5,
  },
});

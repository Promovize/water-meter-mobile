import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import ListItemSeparator from "@/components/common/ListItemSeparator";
import ListItem from "@/components/common/ListItem";
import { defaultColors } from "@/components/theme/colors";
import { getHistory } from "@/api/userFetcher";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthProvider";

export enum Status {
  Blurry = "BLURRY",
  NoMeter = "NO_METER",
  NoMeterDetails = "NO_METER_DETAILS",
  Success = "SUCCESS",
}

const ActivitiesScreen = () => {
  const { user } = useAuth();
  const {
    data: scansHistory,
    mutate,
    error,
    isValidating,
  } = useSWR(user ? "history" : null, () => getHistory(user?.id as string));
  const isLoading = !scansHistory && !error;

  console.log({ scansHistory: scansHistory?.[0] });

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

  const statusToIcon = (status: Status) => {
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

  const convertMeterNumber = (meterNumber: string) => {
    const firstTwo = meterNumber.slice(0, 2);
    const lastTwo = meterNumber.slice(-2);
    const converted = `${firstTwo}...${lastTwo}`;
    return converted;
  };

  return (
    <View style={styles.container}>
      <Text variant='titleSmall' style={styles.historyTitle}>
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
        renderItem={({ item }) => (
          <ListItem
            date={item.date}
            status={statusToText(item.status as Status)}
            statusColor={statusToColor(item.status as Status)}
            title={`Meter No ${convertMeterNumber(item.meter_numbers?.name || "") || "-"} `}
            subtitle={`FRW ${item.amount || "2000"}`}
            icon={statusToIcon(item.status as Status)}
          />
        )}
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
    // flex: 1,
    width: "100%",
    backgroundColor: "orange",
  },
});

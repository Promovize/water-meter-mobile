import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import ListItemSeparator from "@/components/common/ListItemSeparator";
import ListItem from "@/components/common/ListItem";
import { defaultColors } from "@/components/theme/colors";

export enum Status {
  Blurry = "BLURRY",
  NoMeter = "NO_METER",
  NoMeterDetails = "NO_METER_DETAILS",
  Success = "SUCCESS",
}

const ActivitiesScreen = () => {
  const history: any[] = [
    { id: "1", date: new Date(), status: Status.Blurry, meterNumber: "123456789", amount: 10000 },
    { id: "2", date: new Date(), status: Status.NoMeter, meterNumber: "123456789", amount: 10000 },
    { id: "3", date: new Date(), status: Status.NoMeterDetails, meterNumber: "123456789", amount: 10000 },
    { id: "4", date: new Date(), status: Status.Success, meterNumber: "123456789", amount: 10000 },
  ];

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

  return (
    <View style={styles.container}>
      <View style={styles.history}>
        <Text variant='titleSmall' style={styles.historyTitle}>
          History
        </Text>
        <FlatList
          data={history}
          ItemSeparatorComponent={ListItemSeparator}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListItem
              date={item.date}
              status={statusToText(item.status as Status)}
              statusColor={statusToColor(item.status as Status)}
              title={`Meter No ${item.meterNumber}`}
              subtitle={`FRW ${item.amount}`}
              icon={statusToIcon(item.status as Status)}
            />
          )}
        />
      </View>
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
});

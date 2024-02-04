import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import useSWR from "swr";
import { getInvoices } from "@/api/userFetcher";
import ListItem, { InvoiceStatus } from "./common/ListItem";
import { defaultColors } from "./theme/colors";
import { Text } from "react-native-paper";
import ListItemSeparator from "./common/ListItemSeparator";
import { convertMeterNumber } from "@/app/(tabs)/activities";

const InvoicesList = () => {
  const { user } = useAuth();
  const {
    data: invoices,
    mutate,
    isValidating,
    isLoading,
  } = useSWR(user ? "invoices" : null, () => getInvoices(user?.id as string));

  const statusToColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Success:
        return defaultColors.success;
      case InvoiceStatus.Failed:
        return defaultColors.error;
    }
  };

  return (
    <View style={styles.invoices}>
      <Text variant="titleSmall" style={styles.invoicesTitle}>
        Invoices
      </Text>
      <FlatList
        data={invoices}
        ItemSeparatorComponent={ListItemSeparator}
        onRefresh={() => mutate()}
        refreshing={isLoading || isValidating}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            date={item.created_at}
            status={item.status}
            statusColor={statusToColor(item.status as InvoiceStatus)}
            title={`Meter No ${
              convertMeterNumber(
                item.meter_numbers?.name || item.actual_meter_number || ""
              ) || "-"
            }`}
            subtitle={`FRW ${item.amount}`}
            icon="exchange"
          />
        )}
      />
    </View>
  );
};

export default InvoicesList;

const styles = StyleSheet.create({
  invoices: {
    width: "100%",
    flex: 1,
  },
  invoicesTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },
});

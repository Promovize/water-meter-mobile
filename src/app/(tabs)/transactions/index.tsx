import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import { invoices } from "..";
import ListItemSeparator from "@/components/common/ListItemSeparator";
import ListItem, { InvoiceStatus } from "@/components/common/ListItem";
import { defaultColors } from "@/components/theme/colors";

const TransactionsScreen = () => {
  const statusToColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Success:
        return defaultColors.success;
      case InvoiceStatus.Failed:
        return defaultColors.error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.invoices}>
        <Text variant='titleSmall' style={styles.invoicesTitle}>
          Invoices
        </Text>
        <FlatList
          data={invoices}
          ItemSeparatorComponent={ListItemSeparator}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              date={item.date}
              status='Success'
              statusColor={statusToColor(item.status as InvoiceStatus)}
              title={`Meter No ${item.meterNumber}`}
              subtitle={`FRW ${item.amount}`}
              icon='exchange'
            />
          )}
        />
      </View>
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  invoices: {
    width: "100%",
  },
  invoicesTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },
  container: {
    flex: 1,
    padding: 20,
  },
});

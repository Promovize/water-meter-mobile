import { StyleSheet, View } from "react-native";
import React from "react";
import InvoicesList from "@/components/InvoicesList";

const TransactionsScreen = () => {
  return (
    <View style={styles.container}>
      <InvoicesList />
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

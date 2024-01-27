import { defaultColors } from "@/components/theme/colors";
import { boxShaddow } from "@/utils/styles";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Image, ImageBackground } from "expo-image";
import { useAuth } from "@/contexts/AuthProvider";
import { FlatList } from "react-native";
import ListItem, { InvoiceStatus } from "@/components/common/ListItem";
import ListItemSeparator from "@/components/common/ListItemSeparator";
import NewLeakageFab from "@/components/common/NewLeakageFab";
import { Link, useRouter } from "expo-router";
import InvoicesList from "@/components/InvoicesList";

export const invoices = [
  {
    id: "1",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "2",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "3",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "4",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "5",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "6",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "7",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "8",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "9",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "10",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "11",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "12",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
  {
    id: "13",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Success",
  },
  {
    id: "14",
    amount: 10000,
    date: new Date(),
    meterNumber: "123456789",
    status: "Failed",
  },
];

const HomeScreen = () => {
  const { user } = useAuth();
  const cardNumber = "1234 **** **** 3456";
  const router = useRouter();

  const statusToColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Success:
        return defaultColors.success;
      case InvoiceStatus.Failed:
        return defaultColors.error;
    }
  };

  const convertNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/card-bg.jpeg")}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Image
            source={require("../../assets/images/Visa.png")}
            style={styles.visaLogo}
            contentFit="contain"
          />
          <Text variant="titleSmall" style={styles.solde}>
            <Text variant="titleSmall" style={styles.currency}>
              FRW
            </Text>{" "}
            {convertNumber(user?.solde || 0)}
          </Text>
        </View>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
        </View>
        <Text variant="titleSmall" style={styles.names}>
          {user?.full_name}
        </Text>
      </ImageBackground>
      <InvoicesList />
      <NewLeakageFab />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  card: {
    width: "100%",
    padding: 20,
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
    ...boxShaddow,
    position: "relative",
  },
  visaLogo: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  solde: {
    color: defaultColors.white,
    fontWeight: "bold",
  },
  currency: {
    fontWeight: "bold",
    color: defaultColors.white,
  },

  cardNumber: {
    color: defaultColors.white,
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 2,
    fontStyle: "italic",
  },
  cardNumberContainer: {
    marginTop: 35,
  },
  names: {
    position: "absolute",
    bottom: 20,
    right: 20,
    color: defaultColors.white,
  },
  invoices: {
    width: "100%",
    paddingBottom: 370,
  },
  invoicesTitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
    marginBottom: 10,
  },
});

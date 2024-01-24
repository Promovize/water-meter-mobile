import { View } from "react-native";
import { defaultColors } from "../theme/colors";
import { Text } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import chroma from "chroma-js";
import { StyleSheet } from "react-native";
import moment from "moment";

export enum InvoiceStatus {
  Success = "Success",
  Failed = "Failed",
}

export type Invoice = {
  id: string;
  amount: number;
  date: Date;
  meterNumber: string;
  status: InvoiceStatus;
};

type InvoiceItemProps = {
  title: string;
  subtitle: string;
  date: Date;
  status: string;
  statusColor?: string;
  icon?: React.ComponentProps<typeof FontAwesome>["name"];
};

const ListItem = (props: InvoiceItemProps) => {
  const { date, status, statusColor, subtitle, title, icon = "history" } = props;

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.iconWrapper}>
        <FontAwesome name={icon} size={24} color={defaultColors.primary} />
      </View>
      <View style={styles.listItemDetails}>
        <View style={styles.itemUp}>
          <Text variant='titleMedium' numberOfLines={1}>
            {title}
          </Text>
          <Text variant='titleMedium'>{subtitle}</Text>
        </View>
        <View style={styles.itemDown}>
          <Text variant='titleSmall' style={{ color: statusColor }}>
            {status}
          </Text>
          <Text variant='titleSmall' style={styles.date}>
            {moment(date).format("DD MMM YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.gray200,
    flex: 1,
  },
  listItemDetails: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 2,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: chroma(defaultColors.primary).alpha(0.2).hex(),
    justifyContent: "center",
    alignItems: "center",
  },
  itemUp: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: defaultColors.gray500,
  },
});

export default ListItem;

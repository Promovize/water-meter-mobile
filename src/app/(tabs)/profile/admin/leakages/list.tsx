import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { getAllLeakages } from "@/api/userFetcher";
import useSWR from "swr";
import { DataTable } from "react-native-paper";
import { defaultColors } from "@/components/theme/colors";
import { boxShaddow } from "@/utils/styles";
import moment from "moment";
import { Link } from "expo-router";

const LeakagesScreen = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;
  const {
    data: users = [],
    error,
    isLoading,
  } = useSWR(`/leakages?from=${from}&to=${to}`, () =>
    getAllLeakages({ from, to })
  );

  if (error) {
    Alert.alert("Error fetching users", error.message);
  }

  const pagedLeakages = users.slice(from, to);

  const convertLocationValues = (value: string) => {
    return value.toString().slice(0, 6) + "...";
  };

  return (
    <View>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header style={styles.headerWrapper}>
            <DataTable.Title style={{ width: 80 }}>
              <Text style={[styles.header]}>View</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 120 }}>
              <Text style={styles.header}>Date</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 120 }}>
              <Text style={styles.header}>Longitude</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 120 }}>
              <Text style={styles.header}>Latitude</Text>
            </DataTable.Title>
          </DataTable.Header>

          {isLoading && (
            <DataTable.Row>
              <DataTable.Cell>Loading...</DataTable.Cell>
            </DataTable.Row>
          )}
          {!isLoading && !users?.length && (
            <DataTable.Row>
              <DataTable.Cell>No users found</DataTable.Cell>
            </DataTable.Row>
          )}

          {pagedLeakages.map((leakage: any) => {
            const location = JSON.parse(leakage.location);
            const { coords } = JSON.parse(location);
            return (
              <DataTable.Row key={leakage.id}>
                <DataTable.Cell>
                  <Link href={`/(tabs)/profile/admin/leakages/${leakage.id}`}>
                    <Text
                      style={{
                        color: defaultColors.primary,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      }}
                    >
                      View Details
                    </Text>
                  </Link>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>
                    {moment(leakage.created_at).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{convertLocationValues(coords.longitude)}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{convertLocationValues(coords.latitude)}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil((users?.length || 0) / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${users?.length}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel="Rows per page"
      />
    </View>
  );
};

export default LeakagesScreen;

const styles = StyleSheet.create({
  header: {
    color: defaultColors.white,
  },
  headerWrapper: {
    backgroundColor: defaultColors.primary,
    color: "white",
  },
  row: {},
  menuContainer: {
    ...boxShaddow,
  },
  menuItem: {
    backgroundColor: defaultColors.white,
  },
});

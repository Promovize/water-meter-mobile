import { View, Alert, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { Checkbox, DataTable, Menu, Text } from "react-native-paper";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { defaultColors } from "@/components/theme/colors";

const UsersList = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);

  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  const fetcher = async () => {
    const { data, error } = await supabase.from("profiles").select("*").range(from, to);
    if (error) throw error;
    return data;
  };

  const { data: users, error } = useSWR("/users", fetcher);
  const isLoading = !users && !error;

  if (error) {
    Alert.alert("Error fetching users", error.message);
  }

  return (
    <View>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header style={styles.headerWrapper}>
            <DataTable.Title style={{ width: 150 }}>
              <Text style={styles.header}>Full Name</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150 }}>
              <Text style={styles.header}>Email</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 80 }}>
              <Text style={styles.header}>Role</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150 }}>
              <Text style={styles.header}>Phone</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 50 }}>
              <Text style={[styles.header]}>Actions</Text>
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

          {users?.map((user) => (
            <DataTable.Row key={user.id} style={styles.row}>
              <DataTable.Cell style={{ width: 150, paddingRight: 10 }}>
                <Text numberOfLines={1} ellipsizeMode='tail'>
                  {user.full_name}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150, paddingRight: 10 }}>{user.email}</DataTable.Cell>
              <DataTable.Cell style={{ width: 80 }}>
                <Text variant='titleSmall'>{user.role}</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>{user.phone}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 1, width: 50 }}>
                <MenuDropdown />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={3}
        onPageChange={(page) => setPage(page)}
        label='1-2 of 6'
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel='Rows per page'
      />
    </View>
  );
};

export default UsersList;

const MenuDropdown = () => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    // dots
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<MaterialCommunityIcons name='dots-vertical' size={24} onPress={openMenu} />}
    >
      <Menu.Item onPress={() => {}} title='Edit' />
      <Menu.Item onPress={() => {}} title='Delete' />
    </Menu>
  );
};

const styles = StyleSheet.create({
  header: {
    color: defaultColors.white,
  },
  headerWrapper: {
    backgroundColor: defaultColors.primary,
    color: "white",
  },
  row: {},
});

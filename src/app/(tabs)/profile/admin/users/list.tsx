import { View, Alert, StyleSheet, ScrollView } from "react-native";
import React, { useEffect } from "react";
import {
  Button,
  DataTable,
  Dialog,
  FAB,
  IconButton,
  Menu,
  Portal,
  Text,
} from "react-native-paper";
import useSWR from "swr";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { defaultColors } from "@/components/theme/colors";
import { User, UserRole, useAuth } from "@/contexts/AuthProvider";
import { Link, useRouter } from "expo-router";
import { usersFetcher } from "@/api/userFetcher";
import { boxShaddow } from "@/utils/styles";
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const UsersList = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const { session } = useAuth();
  const token = session?.access_token;
  const [deleting, setDeleting] = React.useState(false);
  const router = useRouter();
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );
  const [deletingUserId, setDeletingUserId] = React.useState<string | null>(
    null
  );

  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;

  const {
    data: users,
    error,
    mutate,
    isLoading,
    isValidating,
  } = useSWR(`/users/`, () => usersFetcher({ from, to }));

  if (error) {
    Alert.alert("Error fetching users", error.message);
  }

  const pagedUsers = (users || []).slice(from, to);

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
    try {
      await axios.delete(`${baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("User deleted successfully");
      mutate();
    } catch (error: any) {
      Alert.alert("Error deleting user", error.message);
    } finally {
      setDeletingUserId(null);
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
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
              <DataTable.Title style={{ width: 80 }}>
                <Text style={styles.header}>Solde (RWF)</Text>
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

            {pagedUsers?.map((user) => (
              <DataTable.Row key={user.id} style={styles.row}>
                <DataTable.Cell style={{ width: 150, paddingRight: 10 }}>
                  <Link href={`/(tabs)/profile/admin/users/${user.id}`}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: defaultColors.primary,
                        fontWeight: "500",
                      }}
                    >
                      {user.full_name}
                    </Text>
                  </Link>
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150, paddingRight: 10 }}>
                  {user.email}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 80 }}>
                  <Text variant="titleSmall">{user.role}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 80 }}>
                  <Text variant="titleSmall">{user.solde}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150 }}>
                  {user.phone}
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 1, width: 50 }}>
                  <MenuDropdown
                    user={user}
                    onDeleteUserRequest={() => setDeletingUserId(user.id)}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
        <View style={styles.paginationWrapper}>
          <View>
            <IconButton
              onPress={() => mutate()}
              style={{ alignSelf: "flex-end" }}
              icon="refresh"
              loading={isValidating || isLoading}
              mode="contained"
            />
          </View>
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
        <ConfirmDeleteDialog
          visible={!!deletingUserId}
          hideDialog={() => setDeletingUserId(null)}
          onConfirm={() => handleDeleteUser(deletingUserId!)}
          loading={deleting}
        />
      </View>
      <FAB
        icon={({ color, size }) => (
          <AntDesign name="plus" color={color} size={size} />
        )}
        color={defaultColors.white}
        style={styles.fab}
        onPress={() => router.push("/(tabs)/profile/admin/users/new")}
      />
    </View>
  );
};

export default UsersList;

type MenuDropdownProps = {
  user: User;
  onDeleteUserRequest: (user: User) => void;
};

const MenuDropdown = (props: MenuDropdownProps) => {
  const { user, onDeleteUserRequest } = props;
  const [visible, setVisible] = React.useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const isAdmin = user.role === UserRole.Admin;

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      style={styles.menuContainer}
      anchor={
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          onPress={openMenu}
        />
      }
    >
      <Menu.Item
        onPress={() => router.push(`/(tabs)/profile/admin/users/${user.id}`)}
        title="Edit"
        style={styles.menuItem}
        leadingIcon={(props) => (
          <MaterialCommunityIcons {...props} name="pencil" />
        )}
      />
      {!isAdmin && (
        <Menu.Item
          onPress={() => {
            onDeleteUserRequest(user);
            closeMenu();
          }}
          title="Delete"
          style={styles.menuItem}
          leadingIcon={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="delete"
              color={defaultColors.error}
            />
          )}
        />
      )}
    </Menu>
  );
};

type ConfirmDeleteDialogProps = {
  visible: boolean;
  hideDialog: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {
  const { visible, hideDialog, onConfirm, loading } = props;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this user?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} disabled={loading}>
            Cancel
          </Button>
          <Button onPress={onConfirm} loading={loading}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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
  paginationWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingRight: 60,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 120,
    backgroundColor: defaultColors.primary,
  },
});

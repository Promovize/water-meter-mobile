import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserRole, useAuth } from "@/contexts/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { RouteProp, useRoute } from "@react-navigation/native";

type Props = {
  children: React.ReactNode;
};

type RootStackParamList = {
  AdminScreensLayout: { id: string }; // Define other routes here
};

type AdminScreensLayoutRouteProp = RouteProp<RootStackParamList, "AdminScreensLayout">;

const AdminScreensLayout = (props: Props) => {
  const { children } = props;
  const { user } = useAuth();
  const route = useRoute<AdminScreensLayoutRouteProp>();
  const { id } = route.params;
  const isNewUserScreen = id === "new";

  if (user?.role !== UserRole.Admin) {
    Alert.alert("You are not authorized to access this page");
    return <Redirect href='/(tabs)/profile' />;
  }

  return (
    <Stack>
      <Stack.Screen name='users/index' />
      <Stack.Screen
        name='users/[id]'
        options={{
          title: isNewUserScreen ? "Create new User" : "Edit User",
        }}
      />
    </Stack>
  );
};

export default AdminScreensLayout;

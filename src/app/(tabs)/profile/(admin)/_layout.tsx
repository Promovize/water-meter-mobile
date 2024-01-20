import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserRole, useAuth } from "@/contexts/AuthProvider";
import { Redirect } from "expo-router";

type Props = {
  children: React.ReactNode;
};

const AdminScreensLayout = (props: Props) => {
  const { children } = props;
  const { user } = useAuth();

  if (user?.role !== UserRole.Admin) {
    return <Redirect href='/(tabs)/profile' />;
  }

  return <View>{children}</View>;
};

export default AdminScreensLayout;

const styles = StyleSheet.create({});

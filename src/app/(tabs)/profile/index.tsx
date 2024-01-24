import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Button, List, MD3Colors, Text } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { Route } from "@/constants/Route";
import chroma from "chroma-js";
import { defaultColors } from "@/components/theme/colors";
import { Image } from "expo-image";
import { UserRole, useAuth } from "@/contexts/AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { boxShaddow } from "@/utils/styles";
import useSWR from "swr";
import { getUserCounters } from "@/api/userFetcher";
import ListItemSeparator from "@/components/common/ListItemSeparator";

type Meter = {
  id: string;
  name: string;
  user_id: string;
};

const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: counters = [], isLoading } = useSWR<Meter[]>(user ? "counters" : null, () =>
    getUserCounters(user?.id as string),
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error logging out", error.message);
    } else {
      router.push(Route.Welcome);
    }
  };

  const paddinTop = insets.top + 20;
  const isUserAdmin = user?.role === UserRole.Admin;

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom + 20 + 80 }}>
      <ScrollView style={[styles.container]}>
        <View
          style={[
            styles.contentHeader,
            {
              paddingTop: paddinTop,
            },
          ]}
        >
          <View style={styles.userProfile}>
            <Image
              source={{
                uri: user?.avatar_url,
              }}
              style={{ width: 100, height: 100 }}
            />
          </View>
          {/* <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile/edit")}
          style={[
            styles.editProfileButton,
            {
              top: paddinTop,
            },
          ]}
        >
          <FontAwesome name='edit' size={24} color='white' />
        </TouchableOpacity> */}
          <Text variant='titleLarge' style={styles.userFullname}>
            {user?.full_name}
          </Text>
          <View>
            <Text variant='bodyMedium' style={{ textAlign: "center" }}>
              {user?.phone}
            </Text>
            <Text variant='bodyMedium' style={{ textAlign: "center" }}>
              {user?.email}
            </Text>
          </View>
        </View>
        <View style={styles.cardsWrapper}>
          <View style={styles.card}>
            <Text style={styles.card1Text}>Meter Counters</Text>
            <Text style={styles.card1Number}>{counters.length}</Text>
          </View>
          <View style={[styles.card, styles.card2]}>
            <Text style={styles.card2Text}>Due Payment</Text>
            <Text style={styles.card2Number}>FRW 0.00</Text>
          </View>
        </View>
        <View style={styles.menuList}>
          <List.Section>
            <List.Subheader>MY COUNTERS</List.Subheader>
            {counters.map((counter) => (
              <List.Item key={counter.id} title={counter.name} />
            ))}
          </List.Section>
        </View>
        <ListItemSeparator />
        <View style={styles.menuList}>
          {isUserAdmin && (
            <List.Section>
              <List.Subheader>MANAGE USERS</List.Subheader>
              <List.Item
                title='List of users'
                onPress={() => router.push("/(tabs)/profile/admin/users/list")}
                left={() => <List.Icon icon='home' />}
              />
              <List.Item
                title='Create new user'
                onPress={() => router.push("/(tabs)/profile/admin/users/new")}
                left={() => <List.Icon color={MD3Colors.tertiary70} icon='folder' />}
              />
            </List.Section>
          )}
          <List.Section>
            <List.Subheader>MANAGE TRANSACTIONS</List.Subheader>
            <List.Item title='List of transactions' left={() => <List.Icon icon='folder' />} />
          </List.Section>
          <Button mode='contained' onPress={handleLogout} icon='logout'>
            Logout
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentHeader: {
    alignItems: "center",
    height: 340,
    width: "100%",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.gray300,
    backgroundColor: chroma(defaultColors.primary).alpha(0.2).hex(),
    gap: 20,
    position: "relative",
  },
  userProfile: {
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: defaultColors.gray400,
  },
  cardsWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: 20,
    gap: 20,
  },

  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    borderRadius: 10,
    backgroundColor: chroma(defaultColors.primary).alpha(0.2).hex(),
    padding: 15,
  },
  card2: {
    backgroundColor: chroma(defaultColors.tomato).alpha(0.2).hex(),
  },
  card1Text: {
    fontSize: 20,
    textAlign: "center",
    color: defaultColors.primary,
  },
  card1Number: {
    fontSize: 40,
    color: defaultColors.primary,
  },
  card2Text: {
    fontSize: 20,
    color: defaultColors.tomato,
  },
  card2Number: {
    fontSize: 40,
    color: defaultColors.tomato,
  },
  userFullname: {
    fontSize: 20,
    fontWeight: "bold",
  },

  menuList: {
    paddingHorizontal: 20,
  },

  editProfileButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: defaultColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    zIndex: 100,
    ...boxShaddow,
  },

  counter: {
    fontWeight: "bold",
  },
});

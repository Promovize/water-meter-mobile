import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, Redirect, Tabs, useNavigation, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { defaultColors } from "@/components/theme/colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text } from "react-native-paper";
import { Route } from "@/constants/Route";
import { useAuth } from "@/contexts/AuthProvider";
import LodingContainer from "@/components/LodingContainer";
import { boxShaddow } from "@/utils/styles";

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  if (loading) {
    return <LodingContainer />;
  }

  if (!session) {
    <Redirect href={Route.Login} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: defaultColors.primary,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          ...boxShaddow,
          borderRadius: 20,
          bottom: 25,
          left: 15,
          right: 15,
          borderTopWidth: 0,
          paddingBottom: 0,
        },
        tabBarItemStyle: {
          paddingBottom: 0,
          marginBottom: 0,
          padding: 0,
          margin: 0,
          paddingVertical: 0,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon='home'
              title='Home'
              active={focused}
              // onPress={() => router.push("/(tabs)")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='transactions/index'
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon='exchange'
              title='Transactions'
              active={focused}
              // onPress={() => navigation.navigate([])}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='scan/index'
        options={{
          title: "Transactions",
          tabBarButton: ({}) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable style={styles.scanButton} onPress={() => {}}>
                <AntDesign name='scan1' size={30} color={defaultColors.secondary} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='activities/index'
        options={{
          title: "Activity",
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon='bell'
              title='Activity'
              active={focused}
              // onPress={() => router.push("/(tabs)/activities")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabItem
              icon='user'
              title='Profile'
              active={focused}
              // onPress={() => router.push("/(tabs)/profile/")}
            />
          ),
        }}
      />
    </Tabs>
  );
}

type TabItemProps = {
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  active?: boolean;
  onPress?: () => void;
};

const TabItem = ({ title, icon, active, onPress }: TabItemProps) => {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <FontAwesome name={icon} size={24} color={active ? defaultColors.primary : defaultColors.gray400} />
      <Text
        style={{
          color: active ? defaultColors.primary : defaultColors.gray400,
          fontSize: 12,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    margin: 0,
    marginBottom: 0,
  },
  scanButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    marginBottom: 0,
    top: -20,
    backgroundColor: defaultColors.primary,
    borderRadius: 100,
    width: 70,
    height: 70,
    overflow: "hidden",
    position: "absolute",
  },
});

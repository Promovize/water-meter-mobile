import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import { defaultColors } from "@/components/theme/colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text } from "react-native-paper";
import { Route } from "@/constants/Route";
import { useAuth } from "@/contexts/AuthProvider";
import LodingContainer from "@/components/LodingContainer";

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { user, loading, session } = useAuth();

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
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
          headerRight: () => (
            <Link href='/modal' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='home'
                    size={25}
                    color={"#000"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name='transactions/index'
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => <TabBarIcon name='money' color={color} />,
        }}
      />
      <Tabs.Screen
        name='activities/index'
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => <TabBarIcon name='history' color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />,
        }}
      />
    </Tabs>
  );
}

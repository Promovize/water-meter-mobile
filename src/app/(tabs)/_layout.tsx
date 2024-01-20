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

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
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
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
          headerRight: () => (
            <Link href='/modal' asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='info-circle'
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
        name='two'
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name='code' color={color} />,
        }}
      />
    </Tabs>
  );
}

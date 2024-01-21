import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { defaultColors } from "@/components/theme/colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text } from "react-native-paper";
import { Route } from "@/constants/Route";
import { useAuth } from "@/contexts/AuthProvider";
import { boxShaddow } from "@/utils/styles";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { triggerLightImpact } from "@/utils/haptics";
import LoadingContainer from "@/components/LoadingContainer";

export default function TabLayout() {
  const { loading, session } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingContainer />;
  }

  if (!session) {
    <Redirect href={Route.Login} />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
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
          display: route.name.includes("scan") ? "none" : "flex",
        },
        tabBarItemStyle: {
          paddingBottom: 0,
          marginBottom: 0,
          padding: 0,
          margin: 0,
          paddingVertical: 0,
          zIndex: 100,
        },
      })}
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
              onPress={() => {
                router.push("/(tabs)/");
              }}
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
              onPress={() => {
                router.push("/(tabs)/transactions");
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='scan'
        options={{
          title: "Scan",
          headerShown: false,
          headerBackground: () => "#000",

          tabBarButton: ({}) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable style={styles.scanButton} onPress={() => router.push("/(tabs)/scan")}>
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
            <TabItem icon='bell' title='Activity' active={focused} onPress={() => router.push("/(tabs)/activities")} />
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
              onPress={() => {
                router.push("/(tabs)/profile");
              }}
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(1.2, { damping: 4 }, () => {
      scale.value = withSpring(1);
    });
    triggerLightImpact();
    onPress?.();
  };

  return (
    <Pressable style={styles.tabItem} onPress={handlePress}>
      <Animated.View style={[animatedStyle, styles.tabItem]}>
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
      </Animated.View>
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

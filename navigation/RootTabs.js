import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import PartyScreen from "../screens/PartyScreen";
import RequestsScreen from "../screens/RequestsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { tokens } from "../theme";

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: "rgba(255,255,255,0.08)",
        },
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: "rgba(255,255,255,0.55)",
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Home: focused ? "musical-notes" : "musical-notes-outline",
            Favorites: focused ? "heart" : "heart-outline",
            Party: focused ? "people" : "people-outline",
            Requests: focused ? "mic" : "mic-outline",
            Profile: focused ? "person" : "person-outline",
          };
          const iconName = iconMap[route.name] || "ellipse";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Party" component={PartyScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

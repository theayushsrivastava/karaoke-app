import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

import { AuthContext } from "../context/AuthContext";
import { tokens } from "../theme";
import AppSafeArea from "../components/common/AppSafeArea";

export default function FavoritesScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <AppSafeArea style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Favorites
        </Text>
        <Text style={styles.subtitle}>Login to save and view your favorite tracks.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Profile")}
          style={styles.primaryBtn}
        >
          Login
        </Button>
      </AppSafeArea>
    );
  }

  return (
    <AppSafeArea style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Favorites
      </Text>
      <Text style={styles.subtitle}>Coming soon (MVP).</Text>
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
    padding: 16,
  },
  title: {
    color: tokens.colors.text,
    fontWeight: "900",
  },
  subtitle: {
    color: tokens.colors.textMuted,
    marginTop: 8,
  },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.md,
  },
});

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Card, TextInput } from "react-native-paper";

import { AuthContext } from "../context/AuthContext";
import { tokens } from "../theme";
import AppSafeArea from "../components/common/AppSafeArea";

export default function RequestsScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <AppSafeArea style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Requests
        </Text>
        <Text style={styles.subtitle}>Login to request karaoke songs.</Text>
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
        Requests
      </Text>
      <Text style={styles.subtitle}>Request a karaoke song (coming soon).</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Search / paste YouTube link"
            placeholder="Song name or URL"
            style={{ backgroundColor: tokens.colors.surface }}
          />
          <Button mode="contained" style={styles.primaryBtn} disabled>
            Request
          </Button>
        </Card.Content>
      </Card>
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
  card: {
    marginTop: 14,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.md,
  },
});

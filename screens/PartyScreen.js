import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Card } from "react-native-paper";

import { AuthContext } from "../context/AuthContext";
import { tokens } from "../theme";
import AppSafeArea from "../components/common/AppSafeArea";

export default function PartyScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <AppSafeArea style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Party
        </Text>
        <Text style={styles.subtitle}>Login to create/join a karaoke party.</Text>
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
        Party
      </Text>
      <Text style={styles.subtitle}>Create or join a party (coming soon).</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" style={styles.primaryBtn} disabled>
            Create Party
          </Button>
          <Button mode="outlined" style={styles.secondaryBtn} disabled>
            Join Party
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
    marginTop: 6,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.md,
  },
  secondaryBtn: {
    marginTop: 10,
    borderColor: "rgba(255,255,255,0.2)",
  },
});

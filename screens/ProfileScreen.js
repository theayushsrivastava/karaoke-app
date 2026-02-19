import React, { useContext, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text, ActivityIndicator, Snackbar } from "react-native-paper";
import * as AuthSession from "expo-auth-session";

import { AuthContext } from "../context/AuthContext";
import { tokens } from "../theme";
import {
  createGoogleAuthRequest,
  EXPO_PROXY_PROJECT,
  EXPO_PROXY_REDIRECT_URI,
  fetchGoogleUserInfo,
  signInWithGoogle,
} from "../utils/googleAuth";
import AppSafeArea from "../components/common/AppSafeArea";

export default function ProfileScreen() {
  const { user, loading, logout, setUser } = useContext(AuthContext);
  const [snack, setSnack] = useState(null);

  // Quick MVP: use Expo proxy. For production you’ll want native iOS/Android client IDs.
  const { discovery, requestConfig } = useMemo(
    () => createGoogleAuthRequest({ useProxy: true }),
    []
  );

  useEffect(() => {
    console.log("Using Google redirectUri:", requestConfig.redirectUri);
  }, [requestConfig.redirectUri]);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    requestConfig,
    discovery
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (response?.type !== "success") return;

        console.log("AuthSession response:", response);

        // Authorization Code + PKCE flow
        const code = response.params?.code;
        if (!code) {
          setSnack("Login failed: missing authorization code.");
          return;
        }

        const tokenResp = await AuthSession.exchangeCodeAsync(
          {
            clientId: requestConfig.clientId,
            code,
            redirectUri: requestConfig.redirectUri,
            extraParams: {
              code_verifier: request?.codeVerifier,
            },
          },
          discovery
        );

        console.log("Token response:", tokenResp);

        const accessToken = tokenResp?.accessToken;
        if (!accessToken) {
          setSnack("Login failed: missing access token.");
          return;
        }

        const profile = await fetchGoogleUserInfo(accessToken);
        if (!mounted) return;
        await setUser(profile);
      } catch (e) {
        if (!mounted) return;
        console.error("Login error:", e);
        setSnack(e?.message || "Login failed.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [response, discovery, request, requestConfig, setUser]);

  const initials = useMemo(() => {
    const name = user?.name || user?.email || "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [user?.name, user?.email]);

  if (loading) {
    return (
      <AppSafeArea style={styles.center}>
        <ActivityIndicator animating color={tokens.colors.primary} />
      </AppSafeArea>
    );
  }

  if (!user) {
    return (
      <AppSafeArea style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Profile
        </Text>
        <Text style={styles.subtitle}>Login to access Favorites and Parties.</Text>
        <Button
          mode="contained"
          disabled={!request}
          onPress={() =>
            promptAsync({
              useProxy: true,
              showInRecents: true,
            })
          }
          style={styles.primaryBtn}
          contentStyle={{ paddingVertical: 10 }}
        >
          Continue with Google
        </Button>

        <Snackbar
          visible={!!snack}
          onDismiss={() => setSnack(null)}
          duration={2500}
        >
          {snack}
        </Snackbar>
      </AppSafeArea>
    );
  }

  return (
    <AppSafeArea style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Profile
      </Text>

      <Card style={styles.card}>
        <Card.Content style={{ alignItems: "center" }}>
          {user?.picture ? (
            <Avatar.Image size={82} source={{ uri: user.picture }} />
          ) : (
            <Avatar.Text size={82} label={initials} />
          )}

          <Text style={styles.name}>{user?.name || "User"}</Text>
          {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={logout} style={styles.logoutBtn}>
        Logout
      </Button>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack(null)}
        duration={2500}
      >
        {snack}
      </Snackbar>
    </AppSafeArea>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.bg,
  },
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
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.md,
  },
  card: {
    marginTop: 12,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  name: {
    marginTop: 12,
    color: tokens.colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  email: {
    marginTop: 4,
    color: tokens.colors.textMuted,
  },
  logoutBtn: {
    marginTop: 14,
    borderColor: "rgba(255,255,255,0.2)",
  },
});

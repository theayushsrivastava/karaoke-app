import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "karaoke.auth.user";

export const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(AUTH_KEY);
        if (!mounted) return;
        setUser(raw ? JSON.parse(raw) : null);
      } catch (_) {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const persistUser = useCallback(async (nextUser) => {
    setUser(nextUser);
    if (!nextUser) {
      await SecureStore.deleteItemAsync(AUTH_KEY);
      return;
    }
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(async () => {
    await persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser: persistUser,
      logout,
    }),
    [user, loading, persistUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
import PlayerScreen from "./screens/PlayerScreen2";
import { paperTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import RootTabs from "./navigation/RootTabs";

// Needed for AuthSession/Google login to correctly close the auth browser tab
// and deliver the result back to the app.
WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Root">
            <Stack.Screen name="Root" component={RootTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

// IMPORTANT: For Expo Go, we need to use the proxy redirect URI
// This must be registered in Google Cloud Console under Authorized Redirect URIs
const EXPO_OWNER = Constants.expoConfig?.owner;
const EXPO_SLUG = Constants.expoConfig?.slug;

export const EXPO_PROXY_PROJECT =
  EXPO_OWNER && EXPO_SLUG ? `@${EXPO_OWNER}/${EXPO_SLUG}` : "@ayusht16/karaoke-single-along";

export const EXPO_PROXY_REDIRECT_URI = `https://auth.expo.io/${EXPO_PROXY_PROJECT}`;

// Web client ID for web-based OAuth (used with Expo proxy)
export const GOOGLE_WEB_CLIENT_ID =
  "680808992323-6n1qu5476tod7bm8cohpvojnlt8cf0vm.apps.googleusercontent.com";

// Native client ID for direct Android/iOS auth (when not using proxy)
export const GOOGLE_ANDROID_CLIENT_ID =
  "680808992323-u43e89pltlf6n22c6qdf604qpmqpbggu.apps.googleusercontent.com";

export function createGoogleAuthRequest({ useProxy = true } = {}) {
  // For Expo Go, we must use the proxy redirect URI
  const redirectUri = useProxy ? EXPO_PROXY_REDIRECT_URI : AuthSession.makeRedirectUri();
  console.log("Generated redirect URI:", redirectUri);

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const requestConfig = {
    clientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri: redirectUri,
    prompt: "select_account",
    responseType: AuthSession.ResponseType.Code,
    usePKCE: false,
    access_type: "offline"
  };

  return { discovery, requestConfig, redirectUri };
}

export async function signInWithGoogle() {
  try {
    // Ensure WebBrowser is properly configured
    await WebBrowser.maybeCompleteAuthSession();
    
    const { discovery, requestConfig } = createGoogleAuthRequest({ useProxy: true });
    
    // Use the existing AuthSession hook approach instead of startAsync
    // This will be handled by the ProfileScreen component
    return { success: false, error: 'Use the existing AuthSession hook approach' };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchGoogleUserInfo(accessToken) {
  const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to load user info: HTTP ${resp.status}`);
  }
  const json = await resp.json();
  return {
    id: json.id,
    name: json.name,
    email: json.email,
    picture: json.picture,
  };
}

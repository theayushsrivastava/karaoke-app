import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

// Ensures the auth redirect completes cleanly when returning from the browser.
WebBrowser.maybeCompleteAuthSession();

export const GOOGLE_WEB_CLIENT_ID =
  "680808992323-6n1qu5476tod7bm8cohpvojnlt8cf0vm.apps.googleusercontent.com";

// IMPORTANT:
// For Expo Go (proxy), you must register this redirect URI in Google Cloud Console:
//   https://auth.expo.io/@ayusht16/karaoke-app
// If you change the Expo username or slug, update this value.
const EXPO_PROXY_PROJECT = "@ayusht16/karaokesingalong";
const EXPO_PROXY_REDIRECT_URI = `https://auth.expo.io/${EXPO_PROXY_PROJECT}`;

export function createGoogleAuthRequest({ useProxy = true } = {}) {
  // In recent SDKs, relying on makeRedirectUri({useProxy:true}) can still yield
  // a local exp:// redirect depending on runtime. For Expo Go proxy auth,
  // we force the documented proxy redirect explicitly.
  const redirectUri = useProxy
    ? EXPO_PROXY_REDIRECT_URI
    : AuthSession.makeRedirectUri();

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const requestConfig = {
    clientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri,
    prompt: "select_account",
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true,
  };

  return { discovery, requestConfig, redirectUri };
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

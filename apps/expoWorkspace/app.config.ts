import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_YmlnLWZsZWEtMzguY2xlcmsuYWNjb3VudHMuZGV2JA";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "expoWorkspace",
  slug: "expoWorkspace",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "diffinlist",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.diffin.diffinlist",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  extra: {
    clerkPublishableKey: CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true,
  },
});

export default defineConfig;

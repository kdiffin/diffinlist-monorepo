import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { FontSizes } from "@/constants/FontSizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { QueryClient, QueryClientProvider } from "react-query";
import { tokenCache } from "../utils/cache";
import Constants from "expo-constants";
import { TRPCProvider } from "../utils/trpc";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInWithOAuth from "@/components/SignInWithOAuth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={"pk_test_YmlnLWZsZWEtMzguY2xlcmsuYWNjb3VudHMuZGV2JA"}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerStyle: {},
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Diffinlist",
                headerTitle: () => <Logo />,
              }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}

function Logo() {
  return (
    <View
      style={{
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <LogoSvg />
      <ThemedText style={{ fontWeight: "800", ...FontSizes["2xl"] }}>
        Diffinlist
      </ThemedText>
    </View>
  );
}

export function LogoSvg() {
  const colorScheme = useColorScheme();

  return (
    <Svg
      aria-hidden={true}
      fill={colorScheme === "light" ? Colors.light.text : Colors.dark.text}
      style={{ height: 24, width: 24 }}
      data-testid="DeblurIcon"
      viewBox="0 0 24 23"
    >
      <Path d="M12 3v18a9 9 0 0 0 0-18z" />
      <Circle cx={6} cy={14} r={1} />
      <Circle cx={6} cy={18} r={1} />
      <Circle cx={10} cy={18} r={1} />
      <Circle cx={6} cy={10} r={1} />
      <Circle cx={3} cy={10} r={0.5} />
      <Circle cx={6} cy={6} r={1} />
      <Circle cx={3} cy={14} r={0.5} />
      <Circle cx={10} cy={21} r={0.5} />
      <Circle cx={10} cy={3} r={0.5} />
      <Circle cx={10} cy={6} r={1} />
      <Circle cx={10} cy={14} r={1.5} />
      <Circle cx={10} cy={10} r={1.5} />
    </Svg>
  );
}

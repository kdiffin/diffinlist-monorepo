import { useOAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      console.log(createdSessionId);

      if (createdSessionId) {
        if (setActive) {
          setActive({ session: createdSessionId });
          console.log("it worked");
        }
      } else {
        console.log("?");

        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Sign in with Discord" onPress={onPress} />
    </View>
  );
};

const styles = {
  container: {
    borderRadius: 12, // Adjust for "rounded-lg" (large radius)
    borderWidth: 2,
    borderColor: "#cccccc", // Adjust for "border-gray-500"
    padding: 16, // Adjust for "p-4" (4 units of padding)
  },
};

export default SignInWithOAuth;

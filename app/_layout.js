// app/_layout.js
import React, { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { auth } from '../firebaseConfig'; // firebaseConfig (ek folder bahar) se auth import
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';

// Yeh function check karega ki user login hai ya nahi
function useAuth() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Firebase se check karo ki user ka state badla ya nahi
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // User hai toh set karo, nahi hai toh null set karo
      setIsReady(true); // Ab humein pata hai, toh ready state true karo
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return { user, isReady };
}


export default function RootLayout() {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const segments = useSegments(); // User abhi app ke kis hisse mein hai

  useEffect(() => {
    if (!isReady) {
      return; // Agar abhi check ho raha hai toh kuch mat karo
    }

    // Check karo ki user login screen par hai ya nahi
    const isAuthScreen = segments[0] === 'login';

    if (!user && !isAuthScreen) {
      // User login nahi hai, aur login screen par bhi nahi hai
      // Toh use login screen par bhejo
      router.replace('/login');
    } else if (user && isAuthScreen) {
      // User login hai, lekin galti se login screen par hai
      // Toh use app ke home (dashboard) par bhejo
      router.replace('/');
    }
  }, [isReady, user, segments, router]); // Jab bhi yeh cheezein badle, dobara check karo

  if (!isReady) {
    // Jab tak auth check ho raha hai, Loading dikhao
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Auth check ho gaya, ab app dikhao
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
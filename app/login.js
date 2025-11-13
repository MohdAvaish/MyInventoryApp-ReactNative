// Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Login/Signup toggle

  // Sign Up function
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up!', response.user.email);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign In function
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in!', response.user.email);
      // Login successful, app apne aap dashboard par le jaayegi (yeh setup hum agle step mein karenge)
    } catch (error) {
      console.error(error);
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Password ko hide karega
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          <Pressable 
            style={styles.button} 
            onPress={isLogin ? handleSignIn : handleSignUp}
          >
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </Pressable>
          
          <Pressable 
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)} // Mode badalne ke liye
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Background ko halka grey kiya
    justifyContent: 'center',
  },
  title: {
    fontSize: 36, // Font bada kiya
    fontWeight: '800', // Font ko extra bold kiya
    color: '#333', // Color ko dark grey kiya
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 55, // Input field thodi badi ki
    backgroundColor: '#FFFFFF', // Input ka background white
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12, // Border ko rounded kiya
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0052CC', // Blue ko thoda dark aur professional kiya
    padding: 18, // Button ko thoda bada kiya
    borderRadius: 12, // Rounded border
    alignItems: 'center',
    marginTop: 10, // Upar se thoda gap
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18, // Font size thoda bada
  },
  toggleButton: {
    marginTop: 25, // Neeche waale button se gap badhaya
    alignItems: 'center',
  },
  toggleText: {
    color: '#0052CC', // Color ko button se match kiya
    fontSize: 16,
    fontWeight: '600', // Thoda bold kiya
  },
});
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, Text, Alert } from 'react-native';
import { API_URL } from '../utils/constants';
import { post } from '../utils/httpRequest';
import { isLoggedIn, removeToken } from '../utils/authUtils';

function Login({ navigation }) {
  const [username, setUsername] = useState('vanan');
  const [password, setPassword] = useState('P@123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    removeToken();
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const registerRequest = {
        username,
        password,
      };

      const response = await post(
        `${API_URL}/auth/generate-otp-to-login`,
        registerRequest,
      );

      if (response.status === 200) {
        const msg = response.data;
        Alert.alert('Success', msg);
        navigation.navigate('InputOtpToLogin', { username });
      }
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        navigation.navigate('Home');
      }
    };

    checkIfLoggedIn();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.linkText}>Forget password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#00aaff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#00aaff',
    fontSize: 16,
    marginTop: 15,
  },
});

export default Login;
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {post} from '../utils/httpRequest';
import {isLoggedIn, removeToken} from '../utils/authUtils';

function Login({navigation}) {
  const [username, setUsername] = useState('vananne');
  const [password, setPassword] = useState('P@123456');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async () => {
    removeToken();
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    if (!username || !password) {
      showMessage('Please fill in both fields.');
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
        showMessage(msg, 'success');
        navigation.navigate('InputOtpToLogin', {username});
      }
    } catch (error) {
      console.log(error.message);
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
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
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  registerText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
  forgotPasswordText: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
});

export default Login;

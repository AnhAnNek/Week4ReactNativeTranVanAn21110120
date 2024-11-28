import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import {API_URL} from '../utils/constants';
import {post} from '../utils/httpRequest';
import {isLoggedIn, removeToken} from '../utils/authUtils';
import {errorToast, successToast} from '../utils/methods';

function Login({navigation}) {
  const [username, setUsername] = useState('vanan');
  const [password, setPassword] = useState('P@123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    removeToken();
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    if (!username || !password) {
      errorToast('Please fill in both fields.');
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
        successToast(msg);
        navigation.navigate('InputOtpToLogin', {username});
      }
    } catch (error) {
      console.log(error.message);
      errorToast('Login failed. Please check your credentials.');
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Forget Password')}>
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
    backgroundColor: '#a855f7',
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
    color: '#a855f7',
    fontSize: 16,
    marginTop: 15,
  },
});

export default Login;

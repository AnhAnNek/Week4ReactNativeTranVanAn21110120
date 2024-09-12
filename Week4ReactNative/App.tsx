import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

const Stack = createNativeStackNavigator();
function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const UserLogin = {
        email: email,
        password: password,
      };

      const response = await axios.post('http://192.168.2.17:8080/login', UserLogin);

      if (response.data && response.data.statusCode === 200) {
        // Extract accessToken from response
        const { accessToken } = response.data.data;

        // Store the accessToken (e.g., in localStorage, AsyncStorage, or context)
        // Here we'll just log it for demonstration
        console.log('Access Token:', accessToken);

        // Navigate to OTP Verification screen
        navigation.navigate('OtpVerification', { email: email, accessToken: accessToken });
      } else {
        Alert.alert('Error', response.data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      // Handle the error
      Alert.alert('Failed to login', error.message || 'An unexpected error occurred.');
    }
  };
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.linkText}>Forget password</Text>
      </TouchableOpacity>
    </View>
  );
}

function Homepage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignUp = async () => {
    try {
      const User = {
        email: email,
        password: password,
      };

      const response = await axios.post('http://192.168.2.17:8080/register', User);

      if (response.status === 200) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      // Handle the error
      Alert.alert('Failed to create account', error.message || 'An unexpected error occurred.');
    }
  };
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Start making your dreams come true</Text>


      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat password"

      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => alert('Sign up with Google')}>
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://192.168.2.17:8080/forgotPassword', null, {
        params: { email: email }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP sent to your email.');
        navigation.navigate('OtpVerification', { email: email });
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Failed to send OTP', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}


function OtpVerification({ route, navigation }) {
  const [otp, setOtp] = useState('');
  const { email, accessToken } = route.params;

  const handleOtpSubmit = async () => {
    try {
      const OTPLogin = {
        otp: otp,
        email: email,
      };

      const response = await axios.post('http://192.168.2.17:8080/verifyOTP', OTPLogin, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.statusCode === 200) {
        if (response.data.data) { // Check if data is true
          Alert.alert('Success', 'Login successfully!');
          navigation.navigate('HelloWorld');
        } else {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      // Handle the error
      Alert.alert('Failed to verify OTP', error.message || 'An unexpected error occurred.');
    }
  };


  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Please enter the OTP sent to your email</Text>

      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

function HelloWorld() {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Hello World!</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={({ navigation }) => ({
            title: 'Sign Up',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="HelloWorld" component={HelloWorld} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ title: 'Forgot Password' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
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
  googleButton: {
    width: '100%',
    height: 50,
    borderColor: '#4285F4',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 16,
  },
  linkText: {
    color: '#00aaff',
    fontSize: 16,
    marginTop: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    color: '#00aaff',
    fontSize: 16,
  },
});

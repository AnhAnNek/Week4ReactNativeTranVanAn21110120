import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://172.16.20.227:8080"

const Stack = createNativeStackNavigator();

const UpdateProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Assuming email is already known
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Fetch email from AsyncStorage (or other method) when component mounts
  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail || '');
    };
    fetchEmail();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken'); // Get the stored access token

      const userProfileUpdate = {
        name: name,
        email: email, // Include email in the request
        phone: phone,
        address: address,
      };

      const response = await axios.post(
        `${BASE_URL}update-profile`, // Update profile endpoint
        userProfileUpdate,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add token in headers if needed
          },
        }
      );

      if (response.data && response.status === 200) {
        Alert.alert('Success', response.data || 'Profile updated successfully.');
        navigation.navigate('Homepage'); // Redirect after successful update
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Failed to update profile', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Update Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const UserLogin = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${BASE_URL}/login`,
        UserLogin
      );

      if (response.data && response.data.statusCode === 200) {
        // Extract accessToken from response
        const { accessToken } = response.data.data;

        await AsyncStorage.setItem('accessToken', accessToken);

        // Store the accessToken (e.g., in localStorage, AsyncStorage, or context)
        // Here we'll just log it for demonstration
        console.log("Access Token:", accessToken);

        // Navigate to OTP Verification screen
        navigation.navigate("OtpVerification", {
          email: email,
          accessToken: accessToken,
        });
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Invalid credentials. Please try again."
        );
      }
    } catch (error) {
      // Handle the error
      Alert.alert(
        "Failed to login",
        error.message || "An unexpected error occurred."
      );
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

      <TouchableOpacity onPress={() => navigation.navigate("Homepage")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text style={styles.linkText}>Forget password</Text>
      </TouchableOpacity>
    </View>
  );
}

function Homepage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignUp = async () => {
    try {
      const User = {
        email: email,
        password: password,
      };

      const response = await axios.post(
        `${BASE_URL}/register`,
        User
      );

      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle the error
      Alert.alert(
        "Failed to create account",
        error.message || "An unexpected error occurred."
      );
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
      <TextInput style={styles.input} placeholder="Repeat password" />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => alert("Sign up with Google")}
      >
        <Text style={styles.googleButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/forgotPassword`,
        null,
        {
          params: { email: email },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "OTP sent to your email.");
        navigation.navigate("OtpVerification", { email: email });
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert(
        "Failed to send OTP",
        error.message || "An unexpected error occurred."
      );
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
  const [otp, setOtp] = useState("");
  const { email, accessToken } = route.params;

  const handleOtpSubmit = async () => {
    try {
      const OTPLogin = {
        otp: otp,
        email: email,
      };

      const response = await axios.post(
        `${BASE_URL}/verifyOTP`,
        OTPLogin,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.statusCode === 200) {
        if (response.data.data) {
          // Fetch user data
          const userResponse = await axios.get(
            `${BASE_URL}/getUserByEmail`,
            {
              params: { email: email },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (userResponse.data && userResponse.data.statusCode === 200) {
            navigation.navigate("HelloWorld", {
              email: userResponse.data.data.email,
              accessToken: accessToken,
              name: userResponse.data.data.name,
              phone: userResponse.data.data.phone,
              address: userResponse.data.data.address,
            });
          } else {
            Alert.alert("Error", "Failed to fetch user details.");
          }
        } else {
          Alert.alert("Error", "Invalid OTP. Please try again.");
        }
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Invalid OTP. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Failed to verify OTP",
        error.message || "An unexpected error occurred."
      );
    }
  };
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Please enter the OTP sent to your email
      </Text>

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
function HelloWorld({ route, navigation }) {
  const { email, name, phone, address, accessToken } = route.params || {};

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require('./assets/ok.webp')} // Replace with your project's image path
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{name || "Emma Phillips"}</Text>
          <Text style={styles.contact}>📞 {phone || "(581)-307-690244"}</Text>
          <Text style={styles.contact}>📧 {email}</Text>
          <Text style={styles.contact}>🏠 {address || "Not Provided"}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("UpdateProfile")}>
            <Text style={styles.buttonText}>Go to Update Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={({ navigation }) => ({
            title: "Sign Up",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="HelloWorld" component={HelloWorld} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{ title: "Forgot Password" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: 'gray',
  },
  contact: {
    fontSize: 14,
    color: '#777',
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00aaff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  googleButton: {
    width: "100%",
    height: 50,
    borderColor: "#4285F4",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  googleButtonText: {
    color: "#4285F4",
    fontSize: 16,
  },
  linkText: {
    color: "#00aaff",
    fontSize: 16,
    marginTop: 15,
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    color: "#00aaff",
    fontSize: 16,
  },
});

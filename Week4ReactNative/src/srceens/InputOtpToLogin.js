import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../utils/constants';
import { post } from '../utils/httpRequest';
import {saveToken, saveUsername} from '../utils/authUtils';
import {errorToast, successToast} from '../utils/methods';

const InputOtpToLogin = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpSubmit = async () => {
    if (otp.length === 6 && username.trim() !== '') {
      setLoading(true);
      try {
        const loginWithOtpRequest = { username, otp };
        const response = await post(
          `${API_URL}/auth/login-with-otp`,
          loginWithOtpRequest,
        );
        console.log(`Response status: ${response.status}`);
        if (response.status === 200) {
          const loginResponse = response?.data;
          console.log(`tokenStr: ${loginResponse?.tokenStr}`);
          await saveToken(loginResponse?.tokenStr);
          await saveUsername(loginResponse?.user?.username);
          successToast('OTP verified successfully!');
          navigation.navigate('Home');
        } else {
          errorToast('Invalid OTP, please try again.');
        }
      } catch (error) {
        console.error(error?.message);
        errorToast('Error verifying OTP, please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      errorToast('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <SafeAreaView style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP to Login</Text>
      <Text style={styles.subtitle}>
        Please enter the OTP sent to your email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
    textAlign: 'center',
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
});

export default InputOtpToLogin;
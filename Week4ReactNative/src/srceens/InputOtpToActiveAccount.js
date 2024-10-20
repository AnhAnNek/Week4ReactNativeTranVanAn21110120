import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { API_URL } from '../utils/constants';
import { put } from '../utils/httpRequest';

const InputOtpToActiveAccount = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const activeAccountRequest = { username, otp };
      const response = await put(`${API_URL}/auth/active-account`, activeAccountRequest);

      if (response.status === 200) {
        Alert.alert('Success', 'Account activated successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Invalid OTP, please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP to Activate Account</Text>
      <Text style={styles.subtitle}>Please enter the OTP sent to your email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Activating...' : 'Submit OTP'}</Text>
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

export default InputOtpToActiveAccount;
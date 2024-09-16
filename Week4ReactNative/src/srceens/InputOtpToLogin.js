import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {post} from '../utils/httpRequest';
import {saveToken} from '../utils/authUtils';

const InputOtpToLogin = ({route, navigation}) => {
  const {username} = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleOtpChange = text => {
    setOtp(text);
  };

  const handleSubmit = async () => {
    if (otp.length === 6 && username.trim() !== '') {
      setLoading(true);
      try {
        const loginWithOtpRequest = {username, otp};
        const response = await post(
          `${API_URL}/auth/login-with-otp`,
          loginWithOtpRequest,
        );
        console.log(`Response status: ${response.status}`);
        if (response.status === 200) {
          const tokenStr = await response?.data?.tokenStr;
          console.log(`tokenStr: ${tokenStr}`);
          await saveToken(tokenStr);
          setSnackbarVisible(true);
          setError('');
          navigation.navigate('Home');
        } else {
          setError('Invalid OTP, please try again.');
        }
      } catch (error) {
        console.error(error?.message);
        setError(error?.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid username and a 6-digit OTP.');
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter OTP to Login</Text>
        <TextInput
          label="OTP"
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}>
          Submit OTP
        </Button>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          duration={3000}>
          OTP submitted successfully!
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default InputOtpToLogin;

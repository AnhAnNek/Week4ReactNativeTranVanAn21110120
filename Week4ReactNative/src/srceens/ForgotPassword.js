import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {TextInput, Button, Snackbar, Text} from 'react-native-paper';
import {API_URL} from '../utils/constants'; // Make sure you have the correct API_URL
import {post} from '../utils/httpRequest';
import {errorToast, successToast} from '../utils/methods';

function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      errorToast('Please enter your email.');
      return;
    }

    try {
      const response = await post(
        `${API_URL}/auth/generate-otp-to-reset-password/${email}`,
      );

      if (response.status === 200) {
        successToast('OTP sent to your email.');
        navigation.navigate('Reset Password'); // Navigate to ResetPassword screen after sending OTP
      }
    } catch (error) {
      console.log(error);
      errorToast('Failed to send OTP. Please try again.');
    }
  };

  const showMessage = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button
          mode="contained"
          onPress={handleForgotPassword}
          style={styles.button}
          labelStyle={styles.buttonText}>
          Send OTP
        </Button>
      </View>
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
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
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#a855f7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default ForgotPassword;

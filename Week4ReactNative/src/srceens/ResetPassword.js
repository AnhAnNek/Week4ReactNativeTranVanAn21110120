import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {TextInput, Button, Snackbar, Text} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {post, put} from '../utils/httpRequest';
import {errorToast, successToast} from '../utils/methods';

function ResetPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword) {
      errorToast('Please fill in all fields.');
      return;
    }

    const data = {
      email,
      otp,
      newPassword,
    };
    try {
      const response = await put(
        `${API_URL}/auth/reset-password-with-otp`,
        data,
      );

      if (response.status === 200) {
        successToast('Password reset successful!');
        navigation.navigate('Login'); // Navigate to Login screen after successful password reset
      }
    } catch (error) {
      console.log(error);
      errorToast('Failed to reset password. Please try again.');
    }
  };

  const showMessage = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="numeric"
        />
        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          labelStyle={styles.buttonText}>
          Reset Password
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

export default ResetPassword;

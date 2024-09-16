import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {put} from '../utils/httpRequest';

const InputOtpToUpdateProfile = ({route, navigation}) => {
  const {user} = route.params;
  const [otp, setOtp] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const editedUser = {...user, otp: otp};
      console.log(`editedUser: ${editedUser}`);

      const response = await put(
        `${API_URL}/auth/update-user-profile-with-otp`,
        editedUser,
      );
      if (response?.status === 200) {
        setSnackbarMessage('Profile updated successfully!');
        setTimeout(() => {
          navigation.navigate('UpdateProfile');
        }, 500);
      } else {
        setError('Invalid OTP, please try again.');
      }
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Enter OTP to Update Profile</Text>
        <TextInput
          label="OTP"
          value={otp}
          onChangeText={setOtp}
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
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}>
          {snackbarMessage}
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

export default InputOtpToUpdateProfile;

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {API_URL} from '../utils/constants';
import {put} from '../utils/httpRequest';
import {errorToast, successToast} from '../utils/methods';

const InputOtpToUpdateProfile = ({route, navigation}) => {
  const {user} = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      errorToast('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const editedUser = {...user, otp};
      const response = await put(
        `${API_URL}/auth/update-user-profile-with-otp`,
        editedUser,
      );

      if (response.status === 200) {
        successToast('Profile updated successfully!');
        navigation.navigate('Home', {screen: 'UpdateProfile'});
      } else {
        errorToast('Invalid OTP, please try again.');
      }
    } catch (error) {
      errorToast('Error updating profile, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.formContainer}>
      <Text style={styles.title}>Enter OTP to Update Profile</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Submit OTP'}
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
});

export default InputOtpToUpdateProfile;

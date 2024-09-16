import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_URL} from '../utils/constants';
import {Picker} from '@react-native-picker/picker';
import {post} from '../utils/httpRequest';

function Register({navigation}) {
  const [username, setUsername] = useState('vananne');
  const [password, setPassword] = useState('P@123456');
  const [fullName, setFullName] = useState('Van An');
  const [email, setEmail] = useState('vanantran05@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+1234567890');
  const [gender, setGender] = useState('MALE');
  const [dob, setDob] = useState('1990-01-01');
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleRegister = async () => {
    const registerRequest = {
      username,
      password,
      fullName,
      email,
      phoneNumber,
      gender,
      dob,
    };

    try {
      const response = await post(`${API_URL}/auth/register`, registerRequest);

      if (response.status === 201) {
        const message = response.data;
        setSnackbarMessage(message);

        navigation.navigate('InputOtpToActiveAccount', {username});
      }
    } catch (error) {
      console.log(error?.message);
      setSnackbarMessage(error.message);
    } finally {
      setSnackbarVisible(true);
    }
  };

  const onDobChange = (event, selectedDate) => {
    setDobPickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          autoCapitalize="none"
        />
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={itemValue => setGender(itemValue)}>
          <Picker.Item label="Male" value="MALE" />
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>

        <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
          <TextInput
            label="Date of Birth (YYYY-MM-DD)"
            value={dob}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>

        {dobPickerVisible && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDobChange}
            maximumDate={new Date()}
          />
        )}

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});

export default Register;

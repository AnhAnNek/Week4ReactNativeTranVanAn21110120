import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker'; // Sử dụng DropDownPicker giống Profile
import {Button, Snackbar} from 'react-native-paper';
import {API_URL} from '../utils/constants';
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
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái tải
  const [open, setOpen] = useState(false);
  const [sexOptions, setSexOptions] = useState([
    {label: 'Male', value: 'MALE'},
    {label: 'Female', value: 'FEMALE'},
    {label: 'Other', value: 'OTHER'},
  ]);

  const handleRegister = async () => {
    setLoading(true);
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
      setLoading(false); // Kết thúc trạng thái tải
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Username */}
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="none"
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Phone Number */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        autoCapitalize="none"
        keyboardType="phone-pad"
      />

      {/* Gender (Dropdown Select) */}
      <Text style={styles.label}>Gender</Text>
      <DropDownPicker
        open={open}
        value={gender}
        items={sexOptions}
        setOpen={setOpen}
        setValue={setGender}
        setItems={setSexOptions}
        placeholder="Select gender"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {/* Date of Birth */}
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
        onPress={() => setDobPickerVisible(true)}
        style={styles.input}>
        <Text>{dob || 'Select Date'}</Text>
      </TouchableOpacity>
      {dobPickerVisible && (
        <DateTimePicker
          value={new Date(dob)}
          mode="date"
          display="default"
          onChange={onDobChange}
          maximumDate={new Date()}
        />
      )}

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>

      {/* Snackbar for displaying messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#a855f7',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;

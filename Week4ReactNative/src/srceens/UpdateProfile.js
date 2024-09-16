import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, TouchableOpacity} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {getToken} from '../utils/authUtils';
import {get, post} from '../utils/httpRequest';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

function UpdateProfile({navigation}) {
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: 'MALE',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dobPickerVisible, setDobPickerVisible] = useState(false);

  const fetchUserByToken = async () => {
    setLoading(true);
    try {
      const tokenStr = await getToken();
      const response = await get(`${API_URL}/auth/get-user-by-token`, {
        params: {
          tokenStr,
        },
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setSnackbarMessage('User not found.');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while fetching user data.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await post(
        `${API_URL}/auth/generate-otp-to-update-profile/${user.username}`,
      );
      if (response.status === 200) {
        const msg = response.data;
        setSnackbarMessage(msg);
        setSnackbarVisible(true);

        console.log(`Edited user: ${JSON.stringify(user)}`);
        navigation.navigate('InputOtpToUpdateProfile', {user});
      } else {
        setSnackbarMessage('Profile update failed.');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(error?.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const onDobChange = (event, selectedDate) => {
    setDobPickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      setUser({...user, dob: formattedDate});
    }
  };

  useEffect(() => {
    fetchUserByToken();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Text
        variant="headlineLarge"
        style={{textAlign: 'center', marginBottom: 20}}>
        Update Profile
      </Text>
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <Card>
          <Card.Content>
            <TextInput
              label="Full Name"
              value={user.fullName}
              onChangeText={text => setUser({...user, fullName: text})}
              style={{marginBottom: 10}}
            />
            <TextInput
              label="Email"
              value={user.email}
              onChangeText={text => setUser({...user, email: text})}
              style={{marginBottom: 10}}
            />
            <TextInput
              label="Phone Number"
              value={user.phoneNumber}
              onChangeText={text => setUser({...user, phoneNumber: text})}
              style={{marginBottom: 10}}
            />
            <TouchableOpacity onPress={() => setDobPickerVisible(true)}>
              <TextInput
                label="Date of Birth (YYYY-MM-DD)"
                value={user.dob}
                editable={false}
                style={{marginBottom: 10}}
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

            <Picker
              selectedValue={user.gender}
              onValueChange={itemValue => setUser({...user, gender: itemValue})}
              style={{marginBottom: 10}}>
              <Picker.Item label="Male" value="MALE" />
              <Picker.Item label="Female" value="FEMALE" />
              <Picker.Item label="Other" value="OTHER" />
            </Picker>
          </Card.Content>
        </Card>
      )}
      <Button
        mode="contained"
        onPress={handleProfileUpdate}
        loading={loading}
        style={{marginTop: 20}}>
        Update Profile
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

export default UpdateProfile;

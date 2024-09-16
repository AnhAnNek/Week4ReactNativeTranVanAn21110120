import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Text,
} from 'react-native-paper';
import {API_URL} from '../utils/constants';
import {getToken, removeToken} from '../utils/authUtils';
import {get} from '../utils/httpRequest';
import tw from 'twrnc';

function Home({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchUserByToken = async () => {
    setLoading(true);
    try {
      const tokenStr = await getToken();
      const response = await get(`${API_URL}/auth/get-user-by-token`, {
        params: {tokenStr},
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

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
        });

        fetchUserByToken();
    }, []);

  const logout = () => {
    removeToken();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={tw`flex-1 justify-center p-5`}>
      <Text style={tw`text-2xl font-bold text-center mb-5`}>User Profile</Text>
      {loading ? (
        <ActivityIndicator animating={true} />
      ) : (
        <Card>
          {user ? (
            <Card.Content>
              <Text style={tw`text-lg font-bold mb-2`}>
                Full name: {user.fullName}
              </Text>
              <Text style={tw`text-base mb-1`}>Username: {user.username}</Text>
              <Text style={tw`text-base mb-1`}>Email: {user.email}</Text>
              <Text style={tw`text-base mb-1`}>
                Phone Number: {user.phoneNumber}
              </Text>
              <Text style={tw`text-base mb-1`}>Date of Birth: {user.dob}</Text>
              <Text style={tw`text-base mb-1`}>Gender: {user.gender}</Text>
              <Text style={tw`text-base mb-1`}>Role: {user.role}</Text>
              <Text style={tw`text-base mb-1`}>
                Bio: {user.bio || 'No bio available'}
              </Text>
              <Text style={tw`text-base mb-1`}>
                Account Created: {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </Card.Content>
          ) : (
            <Card.Content>
              <Text style={tw`text-base text-center`}>
                No user found. Please enter a username.
              </Text>
            </Card.Content>
          )}
        </Card>
      )}
      <Button
        mode="contained"
        onPress={fetchUserByToken}
        loading={loading}
        style={tw`mt-5`}>
        Reload
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('UpdateProfile')}
        loading={loading}
        style={tw`mt-5`}>
        Navigate to Update Profile
      </Button>
      <Button
        mode="contained"
        onPress={logout}
        loading={loading}
        style={tw`mt-5`}>
        Logout
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

export default Home;

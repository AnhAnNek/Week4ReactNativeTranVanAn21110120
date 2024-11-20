import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STR_KEY = 'tokenStrKey';
const USERNAME_KEY = 'usernameKey';

export const isLoggedIn = async () => {
  const tokenStr = await AsyncStorage.getItem(TOKEN_STR_KEY);
  const isLoggedIn = tokenStr !== null && tokenStr !== '[object Object]';
  console.log(`isLoggedIn() method: ${isLoggedIn}`);
  return isLoggedIn;
};

export const saveToken = async tokenStr => {
  try {
    await AsyncStorage.setItem(TOKEN_STR_KEY, tokenStr);
  } catch (error) {
    console.error('Error saving login response', error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_STR_KEY);
    await AsyncStorage.removeItem(USERNAME_KEY);
  } catch (error) {
    console.error('Error removing login response', error);
  }
};

export const getToken = async () => {
  const isLoggedInUser = await isLoggedIn();
  if (!isLoggedInUser) {
    return null;
  }

  try {
    return await AsyncStorage.getItem(TOKEN_STR_KEY);
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

export const saveUsername = async (username) => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
    console.log('Username saved successfully');
  } catch (error) {
    console.error('Error saving username', error);
  }
};

export const getUsername = async () => {
  try {
    const username = await AsyncStorage.getItem(USERNAME_KEY);
    if (username !== null) {
      console.log(`Username retrieved successfully: ${JSON.stringify(username)}`);
      return username;
    }
    console.log('No username found');
    return null;
  } catch (error) {
    console.error('Error retrieving username', error);
    return null;
  }
};

import {getToken, isLoggedIn, removeToken, removeUsername, saveToken, saveUsername} from '../utils/authUtils';
import {get, handleResponse, post, put} from '../utils/httpRequest';

const SUFFIX_AUTH_API_URL = '/auth';

const getCurUser = async () => {
  const isSignedIn = await isLoggedIn();
  if (!isSignedIn) {
    return null;
  }

  const path = `${SUFFIX_AUTH_API_URL}/get-user-by-token`;
  const tokenStr = await getToken();
  const response = await get(path, {
    params: { tokenStr }
  });
  return handleResponse(response, 200);
};

const login = async (loginRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/login`;
  const response = await post(path, loginRequest);

  if (response?.status !== 200) {
    return null;
  }

  const loginResponse = await response.data;
  await saveToken(loginResponse?.tokenStr);
  await saveUsername(loginResponse?.user?.username);
  return loginResponse;
};

const register = async (registerRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/register`;
  const response = await post(path, registerRequest);

  return handleResponse(response, 200);
};

const logout = async () => {
  const path = `${SUFFIX_AUTH_API_URL}/logout`;
  const response = await post(path);

  if (response?.status !== 200) {
    console.error('Logout unsuccessfully');
    return true;
  }

  await removeToken();
  console.log('Logout successfully');
  return false;
};

const activeAccount = async (activeAccountRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/active-account`;
  const response = await put(path, activeAccountRequest);
  return handleResponse(response, 200);
}

const resendOTPToActiveAccount = async (username) => {
  const path = `${SUFFIX_AUTH_API_URL}/resend-otp-to-active-account/${username}`;
  const response = await post(path);
  return handleResponse(response, 200);
}

const AuthService = {
  getCurUser,
  login,
  register,
  logout,
  activeAccount,
  resendOTPToActiveAccount
};

export default AuthService;

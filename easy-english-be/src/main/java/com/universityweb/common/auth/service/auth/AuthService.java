package com.universityweb.common.auth.service.auth;

import com.universityweb.common.auth.dto.UserDTO;
import com.universityweb.common.auth.request.*;
import com.universityweb.common.auth.response.ActiveAccountResponse;
import com.universityweb.common.auth.response.LoginResponse;

public interface AuthService {

    boolean registerStudentAccount(RegisterRequest registerRequest);

    LoginResponse login(LoginRequest loginRequest);

    void logout(String tokenStr);

    UserDTO getUserByTokenStr(String tokenStr);

    String getCurrentUsername();

    void checkAuthorization(String targetUsername);

    UserDTO updateOwnPassword(UpdatePasswordRequest request);

    void generateAndSendOtpToLogin(LoginRequest loginRequest);

    LoginResponse loginWithOtp(OtpRequest loginWithOtpRequest);

    ActiveAccountResponse activateAccount(OtpRequest activeAccountRequest);

    void generateAndSendOtpToUpdateProfile(String username);

    UserDTO updateProfileWithOTP(UpdateProfileWithOTPRequest updateProfileRequest);

    UserDTO resendOTPToActiveAccount(String username);
}

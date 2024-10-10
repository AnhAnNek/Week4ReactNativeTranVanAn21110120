package com.universityweb.common.auth.service.auth;

import com.universityweb.common.auth.dto.UserDTO;
import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.exception.EmailNotFoundException;
import com.universityweb.common.auth.exception.UserAlreadyActiveException;
import com.universityweb.common.auth.exception.UserAlreadyExistsException;
import com.universityweb.common.auth.exception.UserNotActiveException;
import com.universityweb.common.auth.mapper.UserMapper;
import com.universityweb.common.auth.repos.UserRepos;
import com.universityweb.common.auth.request.*;
import com.universityweb.common.auth.response.ActiveAccountResponse;
import com.universityweb.common.auth.response.LoginResponse;
import com.universityweb.common.auth.service.otp.OtpService;
import com.universityweb.common.auth.service.user.UserService;
import com.universityweb.common.security.JwtGenerator;
import com.universityweb.common.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper uMapper = UserMapper.INSTANCE;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtGenerator jwtGenerator;
    private final AuthenticationManager authManager;
    private final OtpService otpService;
    private final UserRepos userRepos;

    @Override
    public boolean registerStudentAccount(RegisterRequest registerRequest) {
        String username = registerRequest.username();
        boolean isExists = userService.existsByUsername(username);
        if (isExists) {
            String msg = "Username already exists";
            throw new UserAlreadyExistsException(msg);
        }

        String email = registerRequest.email();
        String plainPassword = registerRequest.password();
        String encodedPassword = passwordEncoder.encode(plainPassword);
        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .fullName(registerRequest.fullName())
                .email(email)
                .phoneNumber(registerRequest.phoneNumber())
                .bio("")
                .gender(registerRequest.gender())
                .dob(registerRequest.dob())
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.INACTIVE)
                .build();
        user.setPassword(encodedPassword);

        userService.save(user);

        otpService.generateAndSendOtp(email, OtpService.EPurpose.ACTIVE_ACCOUNT);
        return true;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        String username = loginRequest.username();
        String password = loginRequest.password();
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        LocalDateTime curTime = LocalDateTime.now();
        LocalDateTime expirationTime = curTime.plus(SecurityUtils.EXPIRATION_DURATION_MILLIS, ChronoUnit.MILLIS);
        String generatedToken = jwtGenerator.generateToken(username, curTime, expirationTime);
        UserDTO userDTO = userService.getUserByUsername(username);
        return new LoginResponse("Login successfully", "Bearer", generatedToken, userDTO);
    }

    @Override
    public void logout(String tokenStr) {

    }

    @Override
    public UserDTO getUserByTokenStr(String tokenStr) {
        jwtGenerator.validateToken(tokenStr);

        String username = jwtGenerator.getUsernameFromJwt(tokenStr);
        User user = userService.loadUserByUsername(username);
        return uMapper.toDTO(user);
    }

    @Override
    public String getCurrentUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

    @Override
    public void checkAuthorization(String targetUsername) {
        String currentUsername = getCurrentUsername();
        if (targetUsername == null || !targetUsername.equals(currentUsername)) {
            String msg = "User not authorized to access or modify this information";
            throw new SecurityException(msg);
        }
    }

    @Override
    public UserDTO updateOwnPassword(UpdatePasswordRequest request) {
        String usernameToUpdate = request.username();
        checkAuthorization(usernameToUpdate);

        if (!request.password().equals(request.confirmPassword())) {
            throw new SecurityException("Passwords do not match");
        }

        User user = userService.loadUserByUsername(usernameToUpdate);
        String encodedPassword = passwordEncoder.encode(request.password());
        user.setPassword(encodedPassword);

        return saveUserAndConvertToDTO(user);
    }

    @Override
    public void generateAndSendOtpToLogin(LoginRequest loginRequest) {
        String username = loginRequest.username();
        User user = userService.loadUserByUsername(username);
        if (user.getStatus() != User.EStatus.ACTIVE) {
            throw new UserNotActiveException("User account is not active");
        }

        validateUsernameAndPassword(loginRequest);

        String email = userService.getEmailByUsername(loginRequest.username());
        if (email == null || email.isEmpty()) {
            throw new EmailNotFoundException("Email not found");
        }
        otpService.generateAndSendOtp(email, OtpService.EPurpose.LOGIN);
    }

    @Override
    public LoginResponse loginWithOtp(OtpRequest loginWithOtpRequest) {
        String username = loginWithOtpRequest.username();
        String otp = loginWithOtpRequest.otp();
        UserDTO userDTO = userService.getUserByUsername(username);
        String email = userDTO.getEmail();

        otpService.validateOtp(email, otp, OtpService.EPurpose.LOGIN);
        otpService.invalidateOtp(email, OtpService.EPurpose.LOGIN);

        LocalDateTime curTime = LocalDateTime.now();
        LocalDateTime expirationTime = curTime.plus(SecurityUtils.EXPIRATION_DURATION_MILLIS, ChronoUnit.MILLIS);
        String generatedToken = jwtGenerator.generateToken(username, curTime, expirationTime);
        return new LoginResponse("OTP login successfully", "Bearer", generatedToken, userDTO);
    }

    @Override
    public ActiveAccountResponse activateAccount(OtpRequest activeAccountRequest) {
        String username = activeAccountRequest.username();
        String email = userService.getEmailByUsername(username);
        String otp = activeAccountRequest.otp();

        otpService.validateOtp(email, otp, OtpService.EPurpose.ACTIVE_ACCOUNT);
        otpService.invalidateOtp(email, OtpService.EPurpose.ACTIVE_ACCOUNT);

        User user = userService.loadUserByUsername(username);
        user.setStatus(User.EStatus.ACTIVE);
        UserDTO savedUserDTO = saveUserAndConvertToDTO(user);;
        return new ActiveAccountResponse("User account activated successfully", savedUserDTO);
    }

    @Override
    public void generateAndSendOtpToUpdateProfile(String username) {
        checkAuthorization(username);
        User user = userService.loadUserByUsername(username);
        String email = user.getEmail();
        if (email == null || email.isEmpty()) {
            throw new EmailNotFoundException("Email not found");
        }

        otpService.generateAndSendOtp(email, OtpService.EPurpose.UPDATE_PROFILE);
    }

    @Override
    public UserDTO updateProfileWithOTP(
            UpdateProfileWithOTPRequest updateProfileRequest
    ) {
        String username = updateProfileRequest.getUsername();
        checkAuthorization(username);

        User user = userService.loadUserByUsername(username);
        String email = user.getEmail();
        String otp = updateProfileRequest.getOtp();

        otpService.validateOtp(email, otp, OtpService.EPurpose.UPDATE_PROFILE);
        otpService.invalidateOtp(email, OtpService.EPurpose.UPDATE_PROFILE);

        user.setFullName(updateProfileRequest.getFullName());
        user.setEmail(updateProfileRequest.getEmail());
        user.setPhoneNumber(updateProfileRequest.getPhoneNumber());
        user.setBio(updateProfileRequest.getBio());
        user.setGender(updateProfileRequest.getGender());
        user.setDob(updateProfileRequest.getDob());

        return saveUserAndConvertToDTO(user);
    }

    @Override
    public UserDTO resendOTPToActiveAccount(String username) {
        User user = userService.loadUserByUsername(username);
        String email = user.getEmail();

        if (user.getStatus() == User.EStatus.ACTIVE) {
            String msg = "User account is already active. No OTP can be resent.";
            throw new UserAlreadyActiveException(msg);
        }

        otpService.generateAndSendOtp(email, OtpService.EPurpose.ACTIVE_ACCOUNT);

        return saveUserAndConvertToDTO(user);
    }

    private UserDTO saveUserAndConvertToDTO(User user) {
        User savedUser = userRepos.save(user);
        return uMapper.toDTO(savedUser);
    }

    private boolean validateUsernameAndPassword(LoginRequest loginRequest) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return true;
    }
}

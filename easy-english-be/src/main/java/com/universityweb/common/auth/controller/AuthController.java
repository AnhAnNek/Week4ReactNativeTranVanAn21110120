package com.universityweb.common.auth.controller;

import com.universityweb.common.auth.dto.UserDTO;
import com.universityweb.common.auth.request.*;
import com.universityweb.common.auth.response.LoginResponse;
import com.universityweb.common.auth.response.ActiveAccountResponse;
import com.universityweb.common.auth.service.auth.AuthService;
import com.universityweb.common.response.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private static final Logger log = LogManager.getLogger(AuthController.class);

    private final AuthService authService;

    @Operation(
            summary = "Register",
            description = "Add a new student by providing the necessary details in the request body.",
            responses = {
                    @ApiResponse(description = "Student added successfully.", responseCode = "201"),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest registerRequest
    ) {
        log.info("Register method called with request: {}", registerRequest);
        authService.registerStudentAccount(registerRequest);
        String msg = "Register successfully";
        log.info(msg);
        return ResponseEntity.status(HttpStatus.CREATED).body(msg);
    }

    @Operation(
            summary = "Generate OTP for Login",
            description = "Generates a one-time password (OTP) and sends it to the email associated with the provided username.",
            responses = {
                    @ApiResponse(
                            description = "OTP successfully generated and sent to the user's email.",
                            responseCode = "200",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(
                            description = "Email not found.",
                            responseCode = "404",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Internal server error while generating OTP.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @PostMapping("/generate-otp-to-login")
    public ResponseEntity<String> generateOtpToLogin(
            @RequestBody LoginRequest generateOTPRequest
    ) {
        authService.generateAndSendOtpToLogin(generateOTPRequest);
        return ResponseEntity.ok("OTP has been sent to your email");
    }

    @Operation(
            summary = "Login with OTP",
            description = "Login into an account using an OTP.",
            responses = {
                    @ApiResponse(description = "OTP login successfully.", responseCode = "200"),
                    @ApiResponse(
                            description = "OTP not found for the given email: ${email}.",
                            responseCode = "400",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Invalid OTP provided for the given email: ${email}.",
                            responseCode = "400",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "OTP has expired for the given email: ${email}.",
                            responseCode = "403",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/login-with-otp")
    public ResponseEntity<LoginResponse> loginWithOtp(
            @RequestBody OtpRequest loginWithOtpRequest
    ) {
        log.info("Login with OTP method called with request: {}", loginWithOtpRequest);
        LoginResponse loginResponse = authService.loginWithOtp(loginWithOtpRequest);
        log.info("Login with OTP method completed successfully with response: {}", loginResponse);
        return ResponseEntity.ok(loginResponse);
    }

    @Operation(
            summary = "Login",
            description = "Login into an account.",
            responses = {
                    @ApiResponse(description = "Login successfully.", responseCode = "200"),
                    @ApiResponse(
                            description = "Invalid credentials.",
                            responseCode = "401",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "User disabled.",
                            responseCode = "403",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest
    ) {
        log.info("Login method called with request: {}", loginRequest);
        LoginResponse loginResponse = authService.login(loginRequest);
        log.info("Login method completed successfully with response: {}", loginResponse);
        return ResponseEntity.ok(loginResponse);
    }

    @Operation(
            summary = "Logout",
            description = "Logout from an account.",
            responses = {
                    @ApiResponse(description = "Logged out successfully.", responseCode = "200"),
                    @ApiResponse(
                            description = "Invalid tokenStr.",
                            responseCode = "401",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            },
            security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String tokenStr) {
        log.info("Logout method called with token: {}", tokenStr);
        authService.logout(tokenStr);
        log.info("Logout method completed successfully");
        return ResponseEntity.ok("Logged out successfully");
    }

    @Operation(
            summary = "Get User by Token",
            description = "Retrieve user details based on the provided authentication token.",
            responses = {
                    @ApiResponse(
                            description = "User details retrieved successfully.",
                            responseCode = "200",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(
                            description = "Invalid or expired token.",
                            responseCode = "401",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            })
    @GetMapping("/get-user-by-token")
    public ResponseEntity<UserDTO> getUserByTokenStr(@RequestParam String tokenStr) {
        log.info("GetUserByTokenStr method called with token: {}", tokenStr);
        UserDTO userDTO = authService.getUserByTokenStr(tokenStr);
        log.info("GetUserByTokenStr method completed successfully with response: {}", userDTO);
        return ResponseEntity.ok(userDTO);
    }

    @Operation(
            summary = "Update own password",
            description =
                    "Allows the authenticated user to update their own password. The request must include the"
                            + " current password, the new password, and a confirmation of the new password. The"
                            + " passwords must match for the update to be successful.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Password updated successfully.",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDTO.class))),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error.",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @PutMapping("/update-own-password")
    public ResponseEntity<UserDTO> updateOwnPassword(
            @RequestBody UpdatePasswordRequest updatePasswordRequest
    ) {
        log.info("UpdateOwnPassword method called with request: {}", updatePasswordRequest);
        UserDTO userDTO = authService.updateOwnPassword(updatePasswordRequest);
        log.info("UpdateOwnPassword method completed successfully with response: {}", userDTO);
        return ResponseEntity.ok(userDTO);
    }

    @Operation(
            summary = "Activate User Account",
            description = "Activates a user account using the provided email and OTP. Ensures the OTP is valid and not expired.",
            responses = {
                    @ApiResponse(
                            description = "User account activated successfully.",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDTO.class)
                            )
                    ),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    @PutMapping("/active-account")
    public ResponseEntity<ActiveAccountResponse> activeAccount(
            @RequestBody OtpRequest activeAccountRequest
    ) {
        log.info("Received request to activate account with OTP: {}", activeAccountRequest);
        ActiveAccountResponse activateAccount =
                authService.activateAccount(activeAccountRequest);
        log.info("Account activated successfully for user: {}", activeAccountRequest.username());
        return ResponseEntity.ok(activateAccount);
    }

    @Operation(
            summary = "Generate OTP to Update User Profile",
            description = "Generates an OTP for updating the user profile associated with the provided email. " +
                    "The OTP will be sent to the user's email and will be valid for a limited time.",
            responses = {
                    @ApiResponse(
                            description = "OTP generated and sent successfully.",
                            responseCode = "200",
                            content = @Content(mediaType = "application/json")
                    ),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    @PostMapping("/generate-otp-to-update-profile/{username}")
    public ResponseEntity<String> generateOtpToUpdateProfile(
            @PathVariable("username") String username
    ) {
        log.info("Received request to generate otp to update user profile with username: {}", username);
        authService.generateAndSendOtpToUpdateProfile(username);
        log.info("OTP generated successfully for User: {}", username);
        return ResponseEntity.ok("OTP generated successfully");
    }

    @Operation(
            summary = "Update User Profile with OTP",
            description = "Updates the user profile with the provided details and OTP. Ensures the OTP is valid and not expired.",
            responses = {
                    @ApiResponse(
                            description = "User profile updated successfully.",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDTO.class)
                            )
                    ),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)
                            )
                    )
            }
    )
    @PutMapping("/update-user-profile-with-otp")
    public ResponseEntity<UserDTO> updateUserProfileWithOTP(
            @RequestBody UpdateProfileWithOTPRequest updateProfileRequest
    ) {
        log.info("Received request to update user profile with OTP: {}", updateProfileRequest);
        UserDTO userDTO = authService.updateProfileWithOTP(updateProfileRequest);
        log.info("User profile updated successfully for user: {}", updateProfileRequest.getUsername());
        return ResponseEntity.ok(userDTO);
    }
}

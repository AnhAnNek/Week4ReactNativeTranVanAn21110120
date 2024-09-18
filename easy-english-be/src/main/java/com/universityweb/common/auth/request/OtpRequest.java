package com.universityweb.common.auth.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record OtpRequest(
        @Schema(
                description = "Username of the user logging in with OTP",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Username is required")
        String username,

        @Schema(
                description = "One-Time Password (OTP) for login",
                example = "123456",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "OTP is required")
        String otp
) {}

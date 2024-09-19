package com.universityweb.common.auth.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Schema(
                description = "Username of the user",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Username is required")
        String username,

        @Schema(
                description = "Password of the user",
                example = "P@123456789",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Password can not be blank")
        String password
) {}

package com.universityweb.common.auth.request;

import com.universityweb.common.auth.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public record RegisterRequest(
        @Schema(
                description = "Username of the user",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String username,

        @Schema(
                description = "Password of the user",
                example = "P@123456789",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String password,

        @Schema(
                description = "Fullname of the user",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String fullName,

        @Schema(
                description = "Email of the user",
                example = "john@gmail.com",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String email,

        @Schema(
                description = "Phone number of the user",
                example = "+84972640891",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String phoneNumber,

        @Schema(
                description = "Gender of the user",
                example = "MALE",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        User.EGender gender,

        @Schema(
                description = "Day of birth",
                example = "2024-08-05T13:47:06.794Z",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        LocalDate dob
) {}

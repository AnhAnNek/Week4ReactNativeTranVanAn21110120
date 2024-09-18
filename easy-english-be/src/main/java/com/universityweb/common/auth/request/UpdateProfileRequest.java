package com.universityweb.common.auth.request;

import com.universityweb.common.auth.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {

        @Schema(
                description = "Username of the user",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String username;

        @Schema(
                description = "Fullname of the user",
                example = "john",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String fullName;

        @Schema(
                description = "Email of the user",
                example = "john@gmail.com",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String email;

        @Schema(
                description = "Phone number of the user",
                example = "+84972640891",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String phoneNumber;

        @Schema(
                description = "Bio of the user",
                example = "A student.",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private String bio;

        @Schema(
                description = "Gender of the user",
                example = "MALE",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private User.EGender gender;

        @Schema(
                description = "Day of birth",
                example = "2024-08-05T13:47:06.794Z",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private LocalDate dob;
}

package com.universityweb.common.auth.response;

import com.universityweb.common.auth.dto.UserDTO;
import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponse(
        @Schema(
                description = "Message",
                example = "Login successfully"
        )
        String message,

        @Schema(
                description = "Type of the token",
                example = "john"
        )
        String tokenType,

        @Schema(
                description = "Token string",
                example = "qwerqwr234asdgasg..."
        )
        String tokenStr,

        UserDTO user
) {}

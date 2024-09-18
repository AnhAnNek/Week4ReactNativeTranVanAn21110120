package com.universityweb.common.security;

public class SecurityUtils {

    public static final int EXPIRATION_DURATION_MILLIS = 24 * 60 * 60 * 1000;
    public static final String DEFAULT_TOKEN_TYPE = "Bearer ";

    public static final String[] PERMIT_ALL_URLS = {
            "/",
            "api/v1/auth/register/**",
            "api/v1/auth/active-account/**",
            "api/v1/auth/generate-otp-to-login/**",
            "api/v1/auth/login-with-otp/**",
            "api/v1/auth/login/**",
            "api/v1/auth/get-user-by-token/**"
    };

    public static final String[] SWAGGER_URLS = {
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"
    };

    private SecurityUtils() {
    }
}

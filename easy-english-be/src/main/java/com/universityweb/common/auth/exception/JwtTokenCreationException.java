package com.universityweb.common.auth.exception;

public class JwtTokenCreationException extends RuntimeException {
    public JwtTokenCreationException(String message) {
        super(message);
    }
}

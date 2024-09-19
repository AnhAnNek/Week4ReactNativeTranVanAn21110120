package com.universityweb.common.auth.service.otp;

public interface OtpService {
    long OTP_EXPIRATION_MINUTES = 5;

    enum EPurpose {
        LOGIN,
        ACTIVE_ACCOUNT,
        UPDATE_PROFILE
    }

    boolean validateOtp(String email, String otp, EPurpose purpose);
    void invalidateOtp(String email, EPurpose purpose);
    void generateAndSendOtp(String email, EPurpose purpose);
}

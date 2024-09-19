package com.universityweb.common.auth.service.otp;

import com.universityweb.common.auth.exception.ExpiredOtpException;
import com.universityweb.common.auth.exception.InvalidOtpException;
import com.universityweb.common.service.mail.EmailService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {
    private static Logger log = LogManager.getLogger(OtpServiceImpl.class);
    private static final Map<String, OtpRecord> otpCache = new ConcurrentHashMap<>();

    @Autowired
    private EmailService emailService;

    @Override
    public boolean validateOtp(String email, String otp, EPurpose purpose) {
        String key = generateKey(email, purpose);
        OtpRecord otpRecord = otpCache.get(key);

        if (otpRecord == null) {
            throw new InvalidOtpException("OTP not found for the given email: " + email);
        }

        if (otpRecord.expiryTime().isBefore(LocalDateTime.now())) {
            throw new ExpiredOtpException("OTP has expired for the given email: " + email);
        }

        if (!otpRecord.otp().equals(otp)) {
            throw new InvalidOtpException("Invalid OTP provided for the given email: " + email);
        }

        return true;
    }

    @Override
    public void invalidateOtp(String email, EPurpose purpose) {
        String key = generateKey(email, purpose);
        otpCache.remove(key);
    }

    @Override
    public void generateAndSendOtp(String email, EPurpose purpose) {
        String otp = generateOtp(email, purpose);
        switch (purpose) {
            case LOGIN:
                sendOtpToLogin(email, otp);
                break;
            case ACTIVE_ACCOUNT:
                sendOtpToActiveAccount(email, otp);
                break;
            case UPDATE_PROFILE:
                sendOtpToUpdateProfile(email, otp);
                break;
        }
    }

    private void sendOtpToLogin(String toEmail, String otp) {
        String subject = "Login - Your One-Time Password (OTP)";
        String htmlBody = "<h3>Your OTP is: " + otp + "</h3>" +
                "<p>Please use this code to complete your login. The code is valid for " +
                OtpService.OTP_EXPIRATION_MINUTES + " minutes.</p>";

        emailService.sendHtmlContent(toEmail, subject, htmlBody);
    }

    private void sendOtpToActiveAccount(String toEmail, String otp) {
        String subject = "Account Activation - One-Time Password (OTP)";
        String htmlBody = "<h3>Your OTP for account activation is: " + otp + "</h3>" +
                "<p>Please use this code to activate your account. The OTP is valid for " +
                OtpService.OTP_EXPIRATION_MINUTES +
                " minutes from the time of receipt.</p>";

        emailService.sendHtmlContent(toEmail, subject, htmlBody);
    }

    private void sendOtpToUpdateProfile(String toEmail, String otp) {
        String subject = "Update Profile - One-Time Password (OTP)";
        String htmlBody = "<h3>Your OTP for updating profile is: " + otp + "</h3>" +
                "<p>Please use this code to update your profile. The OTP is valid for " +
                OtpService.OTP_EXPIRATION_MINUTES +
                " minutes from the time of receipt.</p>";

        emailService.sendHtmlContent(toEmail, subject, htmlBody);
    }

    private String generateKey(String email, EPurpose purpose) {
        return email + "_" + purpose;
    }

    @Scheduled(fixedRate = 120_000)
    private void removeExpiredOtp() {
        Iterator<String> iterator = otpCache.keySet().iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            OtpRecord otpRecord = otpCache.get(key);

            if (otpRecord != null && otpRecord.expiryTime().isBefore(LocalDateTime.now())) {
                iterator.remove();
            }
        }
    }

    private String generateOtp(String email, EPurpose purpose) {
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        log.info("Generated OTP for {}: {}", email, otp);

        OtpRecord otpRecord = new OtpRecord(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES));
        String key = generateKey(email, purpose);
        otpCache.put(key, otpRecord);

        return otp;
    }

    private record OtpRecord(
            String otp,
            LocalDateTime expiryTime
    ) {}
}

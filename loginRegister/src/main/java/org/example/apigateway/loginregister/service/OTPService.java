package org.example.apigateway.loginregister.service;

import org.example.apigateway.loginregister.model.OTP;
import org.example.apigateway.loginregister.repository.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OTPService {

    @Autowired
    private OTPRepository otpRepository;


    public void deleteOTP(String email) {
        OTP otp = otpRepository.findByEmail(email);
        otpRepository.delete(otp);
    }
    public void newOTP(String email) {
        OTP otpObj = otpRepository.findByEmail(email);
        if (otpObj != null) {
            deleteOTP(email);
        }
        OTP otp = new OTP(email);
        otpRepository.save(otp);
    }

    public boolean checkOTP(String email, String otp) {
        OTP otpObj = otpRepository.findByEmail(email);
        if (otpObj == null) {
            return false;
        }
        if (!otpObj.getOtp().equals(otp)) {
            return false;
        }
        return true;
    }
}

package org.example.apigateway.loginregister.repository;

import org.example.apigateway.loginregister.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OTPRepository extends JpaRepository<OTP, String> {
    OTP findByEmail(String email);
}

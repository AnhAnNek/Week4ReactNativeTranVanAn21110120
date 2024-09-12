package org.example.apigateway.loginregister.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Random;

@Table(name = "otp")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OTP {
    @Id
    @Column(name = "email")
    private String email;
    @Column(name = "otp")
    private String otp;

    public OTP(String email) {
        this.email = email;
        Random random = new Random();
        int randomNumber = 100000 + random.nextInt(900000);
        this.otp = String.valueOf(randomNumber);
    }
}

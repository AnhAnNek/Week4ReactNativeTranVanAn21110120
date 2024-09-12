package org.example.apigateway.loginregister.controller;

import org.example.apigateway.loginregister.model.OTP;
import org.example.apigateway.loginregister.model.User;
import org.example.apigateway.loginregister.model.dto.ResponseLogin;
import org.example.apigateway.loginregister.service.OTPService;
import org.example.apigateway.loginregister.service.UserService;
import org.example.apigateway.loginregister.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class UserController {
    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    private SecurityUtil securityUtil;

    @Autowired
    private UserService userService;
    @Autowired
    private OTPService otpService;
    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.save(user);
        return "User registered successfully";
    }
    @GetMapping("/getAll")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }
    @PostMapping("/login1")
    public boolean login(@RequestBody User user) {
        Boolean check = userService.checkUser(user);
        if (check) {
            otpService.newOTP(user.getEmail());
            return true;
        }
        return false;
    }
    @PostMapping("/verifyOTP")
    public boolean newOTP(@RequestBody OTP otp) {
        Boolean check = otpService.checkOTP(otp.getEmail(), otp.getOtp());
        if (check) {
            return true;
        }
        return false;
    }
    @PostMapping("/forgotPassword")
    public void forgotPassword(@RequestParam String email) {
        otpService.newOTP(email);
    }
    @PostMapping("/login")
    public ResponseEntity<ResponseLogin> login1(@RequestBody User user) {
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);
        String accessToken = securityUtil.createToken(authentication);
        ResponseLogin resLogin = new ResponseLogin();
        resLogin.setAccessToken(accessToken);
        return ResponseEntity.ok().body(resLogin);
    }
}

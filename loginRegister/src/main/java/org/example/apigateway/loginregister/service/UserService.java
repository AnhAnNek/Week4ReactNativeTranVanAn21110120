package org.example.apigateway.loginregister.service;

import org.example.apigateway.loginregister.model.User;
import org.example.apigateway.loginregister.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void save(User user) {
        userRepository.save(user);
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public boolean checkUser(User user) {
        User userLogin = userRepository.findByEmail(user.getEmail());
        if (user == null) {
            return false;
        }
        if (!userLogin.getPassword().equals(user.getPassword())) {
            return false;
        }
        return true;
    }
}

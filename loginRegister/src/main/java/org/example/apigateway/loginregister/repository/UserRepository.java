package org.example.apigateway.loginregister.repository;

import org.example.apigateway.loginregister.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
}

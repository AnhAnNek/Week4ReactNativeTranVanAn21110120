package com.universityweb.common.auth.repos;

import com.universityweb.common.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepos extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUsername(String username);

    @Query(value = "SELECT u.email FROM User u WHERE u.username = :username")
    String getEmailByUsername(@Param("username") String username);
}

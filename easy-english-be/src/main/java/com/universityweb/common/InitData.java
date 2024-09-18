package com.universityweb.common;

import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.service.user.UserService;
import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Transactional
public class InitData {
    private final Logger log = LogManager.getLogger(this.getClass().getName());

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public void init() {
        List<User> users = initUsers();
    }

    private List<User> initUsers() {
        String commonPass = passwordEncoder.encode("P@123456");

        User student1 = User.builder()
                .username("vanan")
                .password(commonPass)
                .fullName("Van An")
                .email("vanan@gmail.com")
                .phoneNumber("+840971640799")
                .bio("Studying at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 12, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User student2 = User.builder()
                .username("hungsam")
                .password(commonPass)
                .fullName("Hung")
                .email("hung@gmail.com")
                .phoneNumber("+840971640788")
                .bio("Studying at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 3, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User teacher = User.builder()
                .username("long")
                .password(commonPass)
                .fullName("Hoang Long")
                .email("long@gmail.com")
                .phoneNumber("+840971640710")
                .bio("Teaching at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 10, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User admin = User.builder()
                .username("admin")
                .password(commonPass)
                .fullName("admin")
                .email("")
                .phoneNumber("")
                .bio("Admin")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2024, 7, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        List<User> users = List.of(student1, student2, teacher, admin);
        try {
            return userService.saveAll(users);
        } catch (HibernateException e) {
            log.error("Error occurred while saving users", e);
            return users;
        }
    }
}

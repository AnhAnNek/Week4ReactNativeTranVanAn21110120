package com.universityweb.common.auth.service.user;

import com.universityweb.common.auth.dto.UserDTO;
import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.request.UpdateProfileRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserService extends UserDetailsService {
    User loadUserByUsername(String username) throws UsernameNotFoundException;

    UserDTO getUserByUsername(String username) throws UsernameNotFoundException;

    boolean existsByUsername(String username);

    User save(User user);

    List<User> saveAll(List<User> users);

    UserDTO update(UpdateProfileRequest updateProfileRequest);

    String getEmailByUsername(String username);
}

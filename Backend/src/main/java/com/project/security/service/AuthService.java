package com.project.security.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.security.dto.LoginRequestDTO;
import com.project.security.dto.LoginResponseDTO;
import com.project.security.dto.SignupRequestDTO;
import com.project.security.entity.User;
import com.project.security.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder; // used in saveUser
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepo userRepo,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User saveUser(SignupRequestDTO signupRequestDTO) {
        String email = signupRequestDTO.getEmail().trim().toLowerCase();

        Optional<User> findUser = userRepo.findByEmail(email);
        if (findUser.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User with the email address '%s' already exists.".formatted(email));
        }

        User user = new User();
        user.setUsername(signupRequestDTO.getUsername());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(signupRequestDTO.getPassword()));
        user.setRole("User");
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepo.save(user);
    }

    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        String email = loginRequestDTO.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            loginRequestDTO.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setId(user.getId());
        loginResponseDTO.setUsername(user.getUsername());
        loginResponseDTO.setEmail(user.getEmail());
        return loginResponseDTO;
    }
}
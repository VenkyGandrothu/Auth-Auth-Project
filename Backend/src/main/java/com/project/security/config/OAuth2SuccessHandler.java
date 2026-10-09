package com.project.security.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.project.security.entity.User;
import com.project.security.repo.UserRepo;
import com.project.security.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserRepo userRepo, @Lazy PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Google account has no email");
            return;
        }
        email = email.trim().toLowerCase();

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            String name = oauthUser.getAttribute("name");
            user = new User();
            user.setEmail(email);
            user.setUsername(name == null || name.isBlank() ? email.substring(0, email.indexOf('@')) : name);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole("USER");
            user.setStatus("ACTIVE");
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userRepo.save(user);
        }

        String token = jwtService.generateToken(email);
        response.sendRedirect("http://localhost:5173/oauth/callback#token=" + token);
    }
}
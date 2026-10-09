package com.project.security.config;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.project.security.entity.User;
import com.project.security.repo.UserRepo;
import com.project.security.service.RoleNames;

import jakarta.transaction.Transactional;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminUsername;

    public AdminAccountInitializer(
            UserRepo userRepo,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword,
            @Value("${app.admin.username:admin}") String adminUsername
    ) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminUsername = adminUsername;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }

        String email = adminEmail.trim().toLowerCase();
        if (userRepo.findByEmail(email).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUsername(adminUsername == null || adminUsername.isBlank() ? "admin" : adminUsername.trim());
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(RoleNames.ADMIN);
        admin.setStatus("ACTIVE");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        userRepo.save(admin);
    }
}

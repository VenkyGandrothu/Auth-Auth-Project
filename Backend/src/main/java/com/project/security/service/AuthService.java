package com.project.security.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.security.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AuthService {
    

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(UserRepo userRepo, PasswordEncoder passwordEncoder){
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }


}

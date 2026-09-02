package com.project.security.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.security.dto.LoginRequestDTO;
import com.project.security.dto.SignupRequestDTO;
import com.project.security.entity.User;
import com.project.security.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/V1/user")
public class AuthUsercontroller {
    

    private final AuthService authService;

    public AuthUsercontroller(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/singup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequestDTO signupRequestDTO){
        authService.saveUser(signupRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/login")
    public ResponseEntity<User> login(@Valid @RequestBody LoginRequestDTO LoginRequestDTO){
        authService.loginUser(LoginRequestDTO);
    } 
    
}

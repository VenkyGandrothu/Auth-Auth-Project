package com.project.security.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.security.entity.User;
import com.project.security.repo.UserRepo;

@Service
public class CustomUserDetails implements UserDetailsService{

    private final UserRepo userRepo;

    public CustomUserDetails(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {

        User user = userRepo.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
        .withUsername(user.getEmail())
        .password(user.getPassword())
        .roles(user.getRole())   // "User" becomes ROLE_User
        .build();
    }
    
}

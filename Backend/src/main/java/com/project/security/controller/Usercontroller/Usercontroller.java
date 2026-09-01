package com.project.security.Usercontroller;

import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.security.dto.SignupRequestDTO;

import jakarta.validation.Valid;

@RestController
public class Usercontroller {
    
    @PostMapping("/singup")
    public RequestEntity<Void> signup(@Valid @RequestBody SignupRequestDTO signupRequestDTO){
        
    }
    
}

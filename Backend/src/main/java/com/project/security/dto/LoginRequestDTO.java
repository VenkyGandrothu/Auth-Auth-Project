package com.project.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoginRequestDTO {
    
    @Email
    @NotEmpty
    private String email;
    @NotEmpty
    private String password;

}

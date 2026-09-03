package com.project.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {
	
	@NotBlank
	private String username;
	@Email
	@NotBlank
	private String email;
	@NotBlank
	private String password;
}

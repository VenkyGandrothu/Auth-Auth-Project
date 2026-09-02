package com.project.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {
	
	@NotEmpty
	private String username;
	@Email
	@NotEmpty
	private String email;
	@NotEmpty
	@NotEmpty
	private String password;
}

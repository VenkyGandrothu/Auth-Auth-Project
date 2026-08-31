package com.project.security.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.security.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long>{
}

package com.telusko.ecom_proj.service;

import com.telusko.ecom_proj.model.User;
import com.telusko.ecom_proj.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Passwords are NOT hashed, as requested for now.
        return userRepository.save(user);
    }
}

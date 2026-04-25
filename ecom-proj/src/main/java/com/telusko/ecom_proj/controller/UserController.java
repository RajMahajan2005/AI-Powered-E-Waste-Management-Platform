package com.telusko.ecom_proj.controller;

import com.telusko.ecom_proj.model.User;
import com.telusko.ecom_proj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/saveUser")
    public ResponseEntity<String> saveUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User data saved successfully.");
    }
}
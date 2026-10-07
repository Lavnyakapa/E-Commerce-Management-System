package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.UserDeleteResponse;
import org.example.ecommercemanagementsystem.dto.UserRequest;
import org.example.ecommercemanagementsystem.dto.UserResponse;
import org.example.ecommercemanagementsystem.entity.UserStatus;
import org.example.ecommercemanagementsystem.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    // =========================================
    // CREATE USER
    // =========================================

    @PostMapping
    public UserResponse createUser(
            @RequestBody UserRequest request
    ) {

        return userService.createUser(request);
    }


    // =========================================
    // GET USER BY ID
    // =========================================

    @GetMapping("/{userId}")
    public UserResponse getUserById(
            @PathVariable Long userId
    ) {

        return userService.getUserById(userId);
    }


    // =========================================
    // GET ALL USERS
    // =========================================

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }


    // =========================================
    // UPDATE USER
    // =========================================

    @PutMapping("/{userId}")
    public UserResponse updateUser(
            @PathVariable Long userId,
            @RequestBody UserRequest request
    ) {

        return userService.updateUser(
                userId,
                request
        );
    }


    // =========================================
    // ACTIVATE / DEACTIVATE USER/sampletest
    // =========================================

    @PatchMapping("/{userId}/status")
    public UserResponse updateUserStatus(
            @PathVariable Long userId,
            @RequestParam UserStatus status
    ) {

        return userService.updateUserStatus(
                userId,
                status
        );
    }


    // =========================================
    // DELETE USER
    // =========================================

    @DeleteMapping("/{userId}")
    public UserDeleteResponse deleteUser(
            @PathVariable Long userId
    ) {

        return userService.deleteUser(userId);
    }
}
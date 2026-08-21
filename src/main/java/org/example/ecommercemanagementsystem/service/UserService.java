package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.UserDeleteResponse;
import org.example.ecommercemanagementsystem.dto.UserRequest;
import org.example.ecommercemanagementsystem.dto.UserResponse;
import org.example.ecommercemanagementsystem.entity.UserStatus;

import java.util.List;

public interface UserService {

    // Create
    UserResponse createUser(
            UserRequest request
    );

    // Get by ID
    UserResponse getUserById(
            Long userId
    );

    // Get all
    List<UserResponse> getAllUsers();

    // Update
    UserResponse updateUser(
            Long userId,
            UserRequest request
    );

    // Activate / Deactivate / Block
    UserResponse updateUserStatus(
            Long userId,
            UserStatus status
    );

    // Delete
    UserDeleteResponse deleteUser(
            Long userId
    );
}
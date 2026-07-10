package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.UserDeleteResponse;
import org.example.ecommercemanagementsystem.dto.UserRequest;
import org.example.ecommercemanagementsystem.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest request);

    UserResponse getUserById(Long userId);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(Long userId, UserRequest request);

    UserDeleteResponse deleteUser(Long userId);
}
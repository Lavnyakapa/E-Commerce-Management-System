package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.UserDeleteResponse;
import org.example.ecommercemanagementsystem.dto.UserRequest;
import org.example.ecommercemanagementsystem.dto.UserResponse;
import org.example.ecommercemanagementsystem.entity.RoleEntity;
import org.example.ecommercemanagementsystem.entity.UserEntity;
import org.example.ecommercemanagementsystem.entity.UserStatus;
import org.example.ecommercemanagementsystem.exception.RoleNotFoundException;
import org.example.ecommercemanagementsystem.exception.UserNotFoundException;
import org.example.ecommercemanagementsystem.repository.RoleRepository;
import org.example.ecommercemanagementsystem.repository.UserRepository;
import org.example.ecommercemanagementsystem.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        RoleEntity role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new RoleNotFoundException(
                                "Role not found with id: " + request.getRoleId()));

        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);

        UserEntity savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(Long userId) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        return mapToResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(Long userId, UserRequest request) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        RoleEntity role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new RoleNotFoundException(
                                "Role not found with id: " + request.getRoleId()));

        // Optional: email duplicate check during update
        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(role);

        UserEntity updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public UserDeleteResponse deleteUser(Long userId) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        userRepository.delete(user);

        return new UserDeleteResponse(
                userId,
                "User deleted successfully"
        );
    }

    private UserResponse mapToResponse(UserEntity user) {

        return UserResponse.builder()
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .status(user.getStatus())
                .roleId(user.getRole().getRoleId())
                .roleName(user.getRole().getRoleName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
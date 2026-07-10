package org.example.ecommercemanagementsystem.dto;

import lombok.Builder;
import lombok.Data;
import org.example.ecommercemanagementsystem.entity.UserStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private UserStatus status;
    private Long roleId;
    private String roleName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
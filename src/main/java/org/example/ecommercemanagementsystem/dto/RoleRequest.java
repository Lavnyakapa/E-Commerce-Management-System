package org.example.ecommercemanagementsystem.dto;

import lombok.Data;
import org.example.ecommercemanagementsystem.entity.RoleStatus;

@Data
public class RoleRequest {

    private String roleName;
    private RoleStatus status;
}
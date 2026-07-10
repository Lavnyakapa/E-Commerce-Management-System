package org.example.ecommercemanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.ecommercemanagementsystem.entity.RoleStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {

    private Long roleId;
    private String roleName;
    private RoleStatus status;
}
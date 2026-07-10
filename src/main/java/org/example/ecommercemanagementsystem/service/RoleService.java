package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.RoleDeleteResponse;
import org.example.ecommercemanagementsystem.dto.RoleRequest;
import org.example.ecommercemanagementsystem.dto.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    RoleResponse getRoleById(Long roleId);

    List<RoleResponse> getAllRoles();

    RoleResponse updateRole(Long roleId, RoleRequest request);

    RoleDeleteResponse deleteRole(Long roleId);
}
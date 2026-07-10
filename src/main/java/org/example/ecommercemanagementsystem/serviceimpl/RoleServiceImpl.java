package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.RoleDeleteResponse;
import org.example.ecommercemanagementsystem.dto.RoleRequest;
import org.example.ecommercemanagementsystem.dto.RoleResponse;
import org.example.ecommercemanagementsystem.entity.RoleEntity;
import org.example.ecommercemanagementsystem.exception.RoleNotFoundException;
import org.example.ecommercemanagementsystem.repository.RoleRepository;
import org.example.ecommercemanagementsystem.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {

        RoleEntity role = new RoleEntity();

        role.setRoleName(request.getRoleName());
        role.setStatus(request.getStatus());

        RoleEntity savedRole = roleRepository.save(role);

        return new RoleResponse(
                savedRole.getRoleId(),
                savedRole.getRoleName(),
                savedRole.getStatus()
        );
    }

    @Override
    public RoleResponse getRoleById(Long roleId) {

        RoleEntity role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RoleNotFoundException("Role not found with id: " + roleId));

        return new RoleResponse(
                role.getRoleId(),
                role.getRoleName(),
                role.getStatus()
        );
    }

    @Override
    public List<RoleResponse> getAllRoles() {

        List<RoleEntity> roles = roleRepository.findAll();

        return roles.stream()
                .map(role -> new RoleResponse(
                        role.getRoleId(),
                        role.getRoleName(),
                        role.getStatus()
                ))
                .toList();
    }

    @Override
    public RoleResponse updateRole(Long roleId, RoleRequest request) {

        RoleEntity existingRole = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RoleNotFoundException("Role not found with id: " + roleId));

        existingRole.setRoleName(request.getRoleName());
        existingRole.setStatus(request.getStatus());

        RoleEntity updatedRole = roleRepository.save(existingRole);

        return new RoleResponse(
                updatedRole.getRoleId(),
                updatedRole.getRoleName(),
                updatedRole.getStatus()
        );
    }

    @Override
    public RoleDeleteResponse deleteRole(Long roleId) {

        RoleEntity role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RoleNotFoundException("Role not found with id: " + roleId));

        roleRepository.delete(role);

        return new RoleDeleteResponse(
                roleId,
                "Role deleted successfully"
        );
    }

}
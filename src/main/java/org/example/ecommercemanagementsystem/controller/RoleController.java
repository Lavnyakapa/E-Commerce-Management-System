package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.RoleDeleteResponse;
import org.example.ecommercemanagementsystem.dto.RoleRequest;
import org.example.ecommercemanagementsystem.dto.RoleResponse;
import org.example.ecommercemanagementsystem.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public RoleResponse createRole(@RequestBody RoleRequest request) {
        return roleService.createRole(request);
    }

    @GetMapping
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/{id}")
    public RoleResponse getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }

    @PutMapping("/{id}")
    public RoleResponse updateRole(@PathVariable Long id,
                                   @RequestBody RoleRequest request) {
        return roleService.updateRole(id, request);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<RoleDeleteResponse> deleteRole(@PathVariable Long id) {

        RoleDeleteResponse response = roleService.deleteRole(id);
        return ResponseEntity.ok(response);
    }
}
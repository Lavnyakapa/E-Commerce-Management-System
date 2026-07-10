package org.example.ecommercemanagementsystem.dto;

import lombok.Data;

@Data
public class UserRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Long roleId;
}
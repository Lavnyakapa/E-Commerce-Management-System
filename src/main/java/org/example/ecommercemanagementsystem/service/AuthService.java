package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.LoginRequest;
import org.example.ecommercemanagementsystem.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
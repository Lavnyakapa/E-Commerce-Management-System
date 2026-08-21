package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {

    Optional<CartEntity> findByUserUserId(Long userId);
}
package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    // Get cart by user id
    Optional<CartEntity> findByUserUserId(Long userId);

    // Check if cart exists for user
    boolean existsByUserUserId(Long userId);
}
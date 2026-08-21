package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.UserEntity;
import org.example.ecommercemanagementsystem.entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository
        extends JpaRepository<WishlistEntity, Long> {

    Optional<WishlistEntity> findByUser(UserEntity user);

    Optional<WishlistEntity> findByUserEmail(String email);
}
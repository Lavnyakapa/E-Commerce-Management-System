package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.AddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {

    List<AddressEntity> findByUserUserId(Long userId);

}
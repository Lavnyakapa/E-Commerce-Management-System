package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity,Long> {
}

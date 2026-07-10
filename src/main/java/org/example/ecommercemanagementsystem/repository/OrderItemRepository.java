package org.example.ecommercemanagementsystem.repository;

import org.example.ecommercemanagementsystem.entity.OrderEntity;
import org.example.ecommercemanagementsystem.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {

    List<OrderItemEntity> findByOrder(OrderEntity order);

}
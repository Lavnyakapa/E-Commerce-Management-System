package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.OrderDeleteResponse;
import org.example.ecommercemanagementsystem.dto.OrderRequest;
import org.example.ecommercemanagementsystem.dto.OrderResponse;
import org.example.ecommercemanagementsystem.entity.OrderStatus;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getAllOrders();

    List<OrderResponse> getOrdersByUser(Long userId);

    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);

    OrderDeleteResponse deleteOrder(Long orderId);
}
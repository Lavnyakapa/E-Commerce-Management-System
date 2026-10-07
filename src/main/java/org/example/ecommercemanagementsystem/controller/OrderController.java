package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.OrderDeleteResponse;
import org.example.ecommercemanagementsystem.dto.OrderRequest;
import org.example.ecommercemanagementsystem.dto.OrderResponse;
import org.example.ecommercemanagementsystem.entity.OrderStatus;
import org.example.ecommercemanagementsystem.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ======================================================
    // CREATE ORDER
    // POST /orders
    // ======================================================

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderRequest request) {

        return ResponseEntity.ok(
                orderService.createOrder(request)
        );
    }

    // ======================================================
    // GET ALL ORDERS
    // GET /orders
    // ======================================================

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // ======================================================
    // GET ORDERS BY USER
    // GET /orders/user/{userId}
    // ======================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                orderService.getOrdersByUser(userId)
        );
    }

    // ======================================================
    // GET ORDER BY ID
    // GET /orders/{orderId}
    // ======================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderService.getOrderById(orderId)
        );
    }

    // ======================================================
    // UPDATE ORDER STATUS
    // PATCH /orders/{orderId}/status
    // ======================================================

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        status
                )
        );
    }

    // ======================================================
    // DELETE ORDER
    // DELETE /orders/{orderId}
    // ======================================================

    @DeleteMapping("/{orderId}")
    public ResponseEntity<OrderDeleteResponse> deleteOrder(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderService.deleteOrder(orderId)
        );
    }
}
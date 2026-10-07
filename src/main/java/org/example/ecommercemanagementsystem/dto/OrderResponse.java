package org.example.ecommercemanagementsystem.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;

    private String orderNumber;

    private Long userId;

    private String customerName;

    private String email;

    // Address details

    private Long addressId;

    private String fullName;

    private String phoneNumber;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    // Order details

    private Double totalAmount;

    private String orderStatus;

    private String paymentStatus;

    private List<OrderItemResponse> items;

    // Order history

    private List<OrderHistoryResponse> orderHistory;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;

import org.example.ecommercemanagementsystem.dto.*;
import org.example.ecommercemanagementsystem.entity.*;
import org.example.ecommercemanagementsystem.exception.AddressNotFoundException;
import org.example.ecommercemanagementsystem.exception.OrderNotFoundException;
import org.example.ecommercemanagementsystem.exception.UserNotFoundException;
import org.example.ecommercemanagementsystem.repository.*;
import org.example.ecommercemanagementsystem.service.OrderService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderHistoryRepository orderHistoryRepository;


    // ================= CREATE ORDER =================

    @Override
    public OrderResponse createOrder(OrderRequest request) {

        // 1. Find user
        UserEntity user =
                userRepository.findById(request.getUserId())
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found with id : "
                                                + request.getUserId()
                                )
                        );


        // 2. Find address
        AddressEntity address =
                addressRepository.findById(request.getAddressId())
                        .orElseThrow(() ->
                                new AddressNotFoundException(
                                        "Address not found with id : "
                                                + request.getAddressId()
                                )
                        );


        // 3. Make sure address belongs to this user
        if (!address.getUser().getUserId().equals(user.getUserId())) {

            throw new RuntimeException(
                    "Address does not belong to the user"
            );
        }


        // 4. Find user's cart
        CartEntity cart =
                cartRepository.findByUserUserId(user.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart not found"
                                )
                        );


        // 5. Check cart is not empty
        if (cart.getCartItems() == null ||
                cart.getCartItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }


        // 6. Create order
        OrderEntity order = new OrderEntity();

        order.setUser(user);

        order.setAddress(address);

        order.setOrderNumber(
                "ORD-" + System.currentTimeMillis()
        );


        // 7. Calculate total
        double totalAmount = 0;

        List<OrderItemEntity> orderItems =
                new ArrayList<>();


        // 8. Convert cart items to order items
        for (CartItemEntity cartItem : cart.getCartItems()) {

            ProductVariantEntity variant =
                    cartItem.getProductVariant();


            if (variant == null) {

                throw new RuntimeException(
                        "Product variant not found for cart item"
                );
            }


            if (variant.getPrice() == null) {

                throw new RuntimeException(
                        "Product price not found"
                );
            }


            if (cartItem.getQuantity() == null ||
                    cartItem.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid cart item quantity"
                );
            }


            double itemTotal =
                    variant.getPrice()
                            * cartItem.getQuantity();


            totalAmount += itemTotal;


            OrderItemEntity item =
                    OrderItemEntity.builder()
                            .order(order)
                            .productVariant(variant)
                            .quantity(cartItem.getQuantity())
                            .price(variant.getPrice())
                            .totalPrice(itemTotal)
                            .build();


            orderItems.add(item);
        }


        // 9. Set order items
        order.setOrderItems(orderItems);


        // 10. Set total amount
        order.setTotalAmount(totalAmount);


        // 11. Set order status
        order.setOrderStatus(
                OrderStatus.PENDING
        );


        // 12. Set payment status
        order.setPaymentStatus(
                PaymentStatus.PENDING
        );


        // 13. Save order
        order = orderRepository.save(order);


        // 14. Create initial order history
        OrderHistoryEntity history =
                OrderHistoryEntity.builder()
                        .order(order)
                        .status(OrderStatus.PENDING)
                        .changedAt(LocalDateTime.now())
                        .build();

        orderHistoryRepository.save(history);


        // 15. Clear cart after successful order creation
        cart.getCartItems().clear();

        cartRepository.save(cart);


        // 16. Return order response
        return mapToResponse(order);
    }


    // ================= GET ORDER BY ID =================

    @Override
    public OrderResponse getOrderById(Long orderId) {

        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with id : "
                                                + orderId
                                )
                        );

        return mapToResponse(order);
    }


    // ================= GET ALL ORDERS =================

    @Override
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ================= GET USER ORDERS =================

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {

        return orderRepository
                .findByUserUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ================= UPDATE ORDER STATUS =================

    @Override
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus status) {

        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found"
                                )
                        );


        // Update current order status
        order.setOrderStatus(status);


        // Save order
        order = orderRepository.save(order);


        // Create order history record
        OrderHistoryEntity history =
                OrderHistoryEntity.builder()
                        .order(order)
                        .status(status)
                        .changedAt(LocalDateTime.now())
                        .build();

        orderHistoryRepository.save(history);


        return mapToResponse(order);
    }


    // ================= DELETE ORDER =================

    @Override
    public OrderDeleteResponse deleteOrder(Long orderId) {

        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found"
                                )
                        );


        orderRepository.delete(order);


        return OrderDeleteResponse.builder()
                .orderId(orderId)
                .message("Order deleted successfully")
                .build();
    }


    // ================= MAPPER =================

    private OrderResponse mapToResponse(
            OrderEntity order) {


        // ================= ORDER ITEMS =================

        List<OrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(item ->
                                OrderItemResponse.builder()

                                        .orderItemId(
                                                item.getOrderItemId()
                                        )

                                        .variantId(
                                                item.getProductVariant()
                                                        .getVariantId()
                                        )

                                        .productName(
                                                item.getProductVariant()
                                                        .getProduct()
                                                        .getProductName()
                                        )

                                        .sku(
                                                item.getProductVariant()
                                                        .getSku()
                                        )

                                        .size(
                                                item.getProductVariant()
                                                        .getSize()
                                        )

                                        .color(
                                                item.getProductVariant()
                                                        .getColor()
                                        )

                                        .quantity(
                                                item.getQuantity()
                                        )

                                        .price(
                                                item.getPrice()
                                        )

                                        .totalPrice(
                                                item.getTotalPrice()
                                        )

                                        .build()

                        )
                        .collect(Collectors.toList());


        // ================= ORDER HISTORY =================

        List<OrderHistoryResponse> orderHistory =
                orderHistoryRepository
                        .findByOrderOrderIdOrderByChangedAtAsc(
                                order.getOrderId()
                        )
                        .stream()
                        .map(history ->
                                OrderHistoryResponse.builder()
                                        .historyId(
                                                history.getHistoryId()
                                        )
                                        .status(
                                                history.getStatus().name()
                                        )
                                        .changedAt(
                                                history.getChangedAt()
                                        )
                                        .build()
                        )
                        .collect(Collectors.toList());


        // ================= ORDER RESPONSE =================

        return OrderResponse.builder()

                .orderId(
                        order.getOrderId()
                )

                .orderNumber(
                        order.getOrderNumber()
                )

                .userId(
                        order.getUser().getUserId()
                )

                .customerName(
                        order.getUser().getFirstName()
                                + " "
                                + order.getUser().getLastName()
                )

                .email(
                        order.getUser().getEmail()
                )


                // ================= ADDRESS =================

                .addressId(
                        order.getAddress().getAddressId()
                )

                .fullName(
                        order.getAddress().getFullName()
                )

                .phoneNumber(
                        order.getAddress().getPhoneNumber()
                )

                .addressLine1(
                        order.getAddress().getAddressLine1()
                )

                .addressLine2(
                        order.getAddress().getAddressLine2()
                )

                .city(
                        order.getAddress().getCity()
                )

                .state(
                        order.getAddress().getState()
                )

                .country(
                        order.getAddress().getCountry()
                )

                .postalCode(
                        order.getAddress().getPostalCode()
                )


                // ================= ORDER =================

                .totalAmount(
                        order.getTotalAmount()
                )

                .orderStatus(
                        order.getOrderStatus().name()
                )

                .paymentStatus(
                        order.getPaymentStatus().name()
                )

                .items(items)

                .orderHistory(orderHistory)

                .createdAt(
                        order.getCreatedAt()
                )

                .updatedAt(
                        order.getUpdatedAt()
                )

                .build();
    }
}
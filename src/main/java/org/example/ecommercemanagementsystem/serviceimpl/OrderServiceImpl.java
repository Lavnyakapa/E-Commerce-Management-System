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


import java.util.*;
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



    // ================= CREATE ORDER =================

    @Override
    public OrderResponse createOrder(OrderRequest request) {


        UserEntity user =
                userRepository.findById(request.getUserId())
                        .orElseThrow(() ->
                                new UserNotFoundException(
                                        "User not found with id : "
                                                + request.getUserId()));



        AddressEntity address =
                addressRepository.findById(request.getAddressId())
                        .orElseThrow(() ->
                                new AddressNotFoundException(
                                        "Address not found with id : "
                                                + request.getAddressId()));



        CartEntity cart =
                cartRepository.findByUserUserId(user.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart not found"));



        if(cart.getCartItems().isEmpty()){

            throw new RuntimeException(
                    "Cart is empty");

        }



        OrderEntity order = new OrderEntity();


        order.setUser(user);

        order.setAddress(address);

        order.setOrderNumber(
                "ORD-" + System.currentTimeMillis()
        );



        double totalAmount = 0;



        List<OrderItemEntity> orderItems =
                new ArrayList<>();



        for(CartItemEntity cartItem :
                cart.getCartItems()){


            ProductVariantEntity variant =
                    cartItem.getProductVariant();



            double itemTotal =
                    variant.getPrice()
                            *
                            cartItem.getQuantity();



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



        order.setOrderItems(orderItems);

        order.setTotalAmount(totalAmount);

        order.setOrderStatus(OrderStatus.PENDING);

        order.setPaymentStatus(PaymentStatus.PENDING);



        order = orderRepository.save(order);



        // Clear cart after order creation

        cart.getCartItems().clear();

        cartRepository.save(cart);



        return mapToResponse(order);

    }



    // ================= GET BY ID =================


    @Override
    public OrderResponse getOrderById(Long orderId){


        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found with id : "
                                                + orderId));


        return mapToResponse(order);

    }



    // ================= GET ALL =================


    @Override
    public List<OrderResponse> getAllOrders(){


        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }



    // ================= GET USER ORDERS =================


    @Override
    public List<OrderResponse> getOrdersByUser(Long userId){


        return orderRepository.findByUserUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }



    // ================= UPDATE STATUS =================


    @Override
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus status){


        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found"));


        order.setOrderStatus(status);


        return mapToResponse(
                orderRepository.save(order)
        );

    }



    // ================= DELETE =================


    @Override
    public OrderDeleteResponse deleteOrder(Long orderId){


        OrderEntity order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new OrderNotFoundException(
                                        "Order not found"));


        orderRepository.delete(order);



        return OrderDeleteResponse.builder()
                .orderId(orderId)
                .message("Order deleted successfully")
                .build();

    }



    // ================= MAPPER =================


    private OrderResponse mapToResponse(
            OrderEntity order){


        List<OrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(item ->

                                OrderItemResponse.builder()

                                        .orderItemId(
                                                item.getOrderItemId())

                                        .variantId(
                                                item.getProductVariant()
                                                        .getVariantId())

                                        .productName(
                                                item.getProductVariant()
                                                        .getProduct()
                                                        .getProductName())

                                        .sku(
                                                item.getProductVariant()
                                                        .getSku())

                                        .size(
                                                item.getProductVariant()
                                                        .getSize())

                                        .color(
                                                item.getProductVariant()
                                                        .getColor())

                                        .quantity(
                                                item.getQuantity())

                                        .price(
                                                item.getPrice())

                                        .totalPrice(
                                                item.getTotalPrice())

                                        .build()

                        ).collect(Collectors.toList());



        return OrderResponse.builder()

                .orderId(order.getOrderId())

                .orderNumber(order.getOrderNumber())

                .userId(order.getUser().getUserId())

                .customerName(
                        order.getUser().getFirstName()
                                +" "
                                +order.getUser().getLastName())

                .email(order.getUser().getEmail())

                .addressId(
                        order.getAddress().getAddressId())

                .fullName(
                        order.getAddress().getFullName())

                .phoneNumber(
                        order.getAddress().getPhoneNumber())

                .addressLine1(
                        order.getAddress().getAddressLine1())

                .city(
                        order.getAddress().getCity())

                .state(
                        order.getAddress().getState())

                .country(
                        order.getAddress().getCountry())

                .postalCode(
                        order.getAddress().getPostalCode())

                .totalAmount(
                        order.getTotalAmount())

                .orderStatus(
                        order.getOrderStatus().name())

                .paymentStatus(
                        order.getPaymentStatus().name())

                .items(items)

                .createdAt(order.getCreatedAt())

                .updatedAt(order.getUpdatedAt())

                .build();

    }

}
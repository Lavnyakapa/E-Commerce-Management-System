package org.example.ecommercemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="order_id",nullable = false)
    private OrderEntity order;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="variant_id",nullable = false)
    private ProductVariantEntity productVariant;



    @Column(nullable = false)
    private Integer quantity;



    @Column(nullable = false)
    private Double price;



    @Column(nullable = false)
    private Double totalPrice;

}
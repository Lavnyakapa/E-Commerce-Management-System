package org.example.ecommercemanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Data
public class ProductEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;


    private String productName;


    private String description;


    private String brand;


    @Enumerated(EnumType.STRING)
    private ProductStatus status;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_category_id")
    private SubCategoryEntity subCategory;



    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<ProductVariantEntity> variants = new ArrayList<>();



    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<ProductImageEntity> images = new ArrayList<>();



    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

    }



    @PreUpdate
    public void preUpdate() {

        updatedAt = LocalDateTime.now();

    }

}
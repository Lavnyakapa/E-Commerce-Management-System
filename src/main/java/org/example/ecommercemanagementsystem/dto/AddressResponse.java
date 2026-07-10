package org.example.ecommercemanagementsystem.dto;

import lombok.Builder;
import lombok.Data;
import org.example.ecommercemanagementsystem.entity.AddressType;

import java.time.LocalDateTime;

@Data
@Builder
public class AddressResponse {

    private Long addressId;

    private Long userId;

    private String fullName;

    private String phoneNumber;

    private String addressLine1;

    private String addressLine2;

    private String landmark;

    private String city;

    private String state;

    private String country;

    private String postalCode;

    private AddressType addressType;

    private Boolean isDefault;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
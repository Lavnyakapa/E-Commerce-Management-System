package org.example.ecommercemanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.ecommercemanagementsystem.entity.AddressType;

@Data
public class AddressRequest {

    @NotNull(message = "User Id is required")
    private Long userId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Phone Number is required")
    private String phoneNumber;

    @NotBlank(message = "Address Line 1 is required")
    private String addressLine1;

    private String addressLine2;

    private String landmark;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Postal Code is required")
    private String postalCode;

    @NotNull(message = "Address Type is required")
    private AddressType addressType;

    private Boolean isDefault;
}
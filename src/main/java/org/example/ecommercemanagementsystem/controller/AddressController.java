package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.AddressDeleteResponse;
import org.example.ecommercemanagementsystem.dto.AddressRequest;
import org.example.ecommercemanagementsystem.dto.AddressResponse;
import org.example.ecommercemanagementsystem.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // Create Address
    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            @RequestBody AddressRequest request) {

        return new ResponseEntity<>(
                addressService.createAddress(request),
                HttpStatus.CREATED);
    }

    // Get Address By Id
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponse> getAddressById(
            @PathVariable Long addressId) {

        return ResponseEntity.ok(
                addressService.getAddressById(addressId));
    }

    // Get All Addresses
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAllAddresses() {

        return ResponseEntity.ok(
                addressService.getAllAddresses());
    }

    // Get Addresses By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddressesByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                addressService.getAddressesByUser(userId));
    }

    // Update Address
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddressRequest request) {

        return ResponseEntity.ok(
                addressService.updateAddress(addressId, request));
    }

    // Delete Address
    @DeleteMapping("/{addressId}")
    public ResponseEntity<AddressDeleteResponse> deleteAddress(
            @PathVariable Long addressId) {

        return ResponseEntity.ok(
                addressService.deleteAddress(addressId));
    }

    // Set Default Address
    @PatchMapping("/{addressId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long addressId) {

        return ResponseEntity.ok(
                addressService.setDefaultAddress(addressId));
    }
}
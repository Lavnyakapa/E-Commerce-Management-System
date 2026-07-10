package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.dto.AddressDeleteResponse;
import org.example.ecommercemanagementsystem.dto.AddressRequest;
import org.example.ecommercemanagementsystem.dto.AddressResponse;

import java.util.List;

public interface AddressService {

    // Create Address
    AddressResponse createAddress(AddressRequest request);

    // Get Address by Id
    AddressResponse getAddressById(Long addressId);

    // Get All Addresses
    List<AddressResponse> getAllAddresses();

    // Get Addresses By User
    List<AddressResponse> getAddressesByUser(Long userId);

    // Update Address
    AddressResponse updateAddress(Long addressId, AddressRequest request);

    // Delete Address
    AddressDeleteResponse deleteAddress(Long addressId);

    // Set Default Address
    AddressResponse setDefaultAddress(Long addressId);
}
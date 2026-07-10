package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.dto.AddressDeleteResponse;
import org.example.ecommercemanagementsystem.dto.AddressRequest;
import org.example.ecommercemanagementsystem.dto.AddressResponse;
import org.example.ecommercemanagementsystem.entity.AddressEntity;
import org.example.ecommercemanagementsystem.entity.UserEntity;
import org.example.ecommercemanagementsystem.exception.AddressNotFoundException;
import org.example.ecommercemanagementsystem.exception.UserNotFoundException;
import org.example.ecommercemanagementsystem.repository.AddressRepository;
import org.example.ecommercemanagementsystem.repository.UserRepository;
import org.example.ecommercemanagementsystem.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    // ================= CREATE ADDRESS =================

    @Override
    public AddressResponse createAddress(AddressRequest request) {

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id : " + request.getUserId()));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<AddressEntity> addresses =
                    addressRepository.findByUserUserId(user.getUserId());

            addresses.forEach(address -> address.setIsDefault(false));

            addressRepository.saveAll(addresses);
        }

        AddressEntity address = AddressEntity.builder()
                .user(user)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .addressType(request.getAddressType())
                .isDefault(request.getIsDefault() != null
                        ? request.getIsDefault()
                        : false)
                .build();

        address = addressRepository.save(address);

        return mapToResponse(address);
    }

    // ================= GET ADDRESS BY ID =================

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressById(Long addressId) {

        AddressEntity address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new AddressNotFoundException(
                                "Address not found with id : " + addressId));

        return mapToResponse(address);
    }

    // ================= GET ALL ADDRESSES =================

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAllAddresses() {

        return addressRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    // ================= GET ADDRESSES BY USER =================

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddressesByUser(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id : " + userId));

        return addressRepository.findByUserUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= UPDATE ADDRESS =================

    @Override
    public AddressResponse updateAddress(Long addressId, AddressRequest request) {

        AddressEntity address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new AddressNotFoundException(
                                "Address not found with id : " + addressId));

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id : " + request.getUserId()));

        if (Boolean.TRUE.equals(request.getIsDefault())) {

            List<AddressEntity> addresses =
                    addressRepository.findByUserUserId(user.getUserId());

            addresses.forEach(a -> a.setIsDefault(false));

            addressRepository.saveAll(addresses);
        }

        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setPostalCode(request.getPostalCode());
        address.setAddressType(request.getAddressType());
        address.setIsDefault(request.getIsDefault());

        address = addressRepository.save(address);

        return mapToResponse(address);
    }

    // ================= DELETE ADDRESS =================

    @Override
    public AddressDeleteResponse deleteAddress(Long addressId) {

        AddressEntity address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new AddressNotFoundException(
                                "Address not found with id : " + addressId));

        addressRepository.delete(address);

        return AddressDeleteResponse.builder()
                .addressId(addressId)
                .message("Address deleted successfully")
                .build();
    }

    // ================= SET DEFAULT ADDRESS =================

    @Override
    public AddressResponse setDefaultAddress(Long addressId) {

        AddressEntity address = addressRepository.findById(addressId)
                .orElseThrow(() ->
                        new AddressNotFoundException(
                                "Address not found with id : " + addressId));

        List<AddressEntity> addresses =
                addressRepository.findByUserUserId(
                        address.getUser().getUserId());

        addresses.forEach(a -> a.setIsDefault(false));

        addressRepository.saveAll(addresses);

        address.setIsDefault(true);

        address = addressRepository.save(address);

        return mapToResponse(address);
    }

    // ================= MAPPER =================

    private AddressResponse mapToResponse(AddressEntity address) {

        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .userId(address.getUser().getUserId())
                .fullName(address.getFullName())
                .phoneNumber(address.getPhoneNumber())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .addressType(address.getAddressType())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}
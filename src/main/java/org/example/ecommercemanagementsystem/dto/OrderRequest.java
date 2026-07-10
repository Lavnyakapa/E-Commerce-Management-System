package org.example.ecommercemanagementsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {


    @NotNull(message = "User id is required")
    private Long userId;


    @NotNull(message = "Address id is required")
    private Long addressId;

}
package org.example.ecommercemanagementsystem.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderHistoryResponse {

    private Long historyId;

    private String status;

    private LocalDateTime changedAt;
}
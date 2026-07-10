package org.example.ecommercemanagementsystem.service;

import org.example.ecommercemanagementsystem.entity.PaymentEntity;

import java.util.List;

public interface PaymentService {
    PaymentEntity createPayment(PaymentEntity payment);
    List<PaymentEntity> getAllPayments();
    PaymentEntity getPaymentById(Long paymentId);
    PaymentEntity updatePayment(Long paymentId,PaymentEntity payment);
    void deletePayment(Long paymentId);
}

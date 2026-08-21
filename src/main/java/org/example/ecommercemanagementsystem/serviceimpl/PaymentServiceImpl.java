package org.example.ecommercemanagementsystem.serviceimpl;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.entity.PaymentEntity;
import org.example.ecommercemanagementsystem.repository.PaymentRepository;
import org.example.ecommercemanagementsystem.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    // =========================================
    // CREATE PAYMENT
    // =========================================

    @Override
    public PaymentEntity createPayment(PaymentEntity payment) {

        return paymentRepository.save(payment);
    }

    // =========================================
    // GET ALL PAYMENTS
    // =========================================

    @Override
    public List<PaymentEntity> getAllPayments() {

        return paymentRepository.findAll();
    }

    // =========================================
    // GET PAYMENT BY ID
    // =========================================

    @Override
    public PaymentEntity getPaymentById(Long paymentId) {

        return paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with id: "
                                        + paymentId
                        )
                );
    }

    // =========================================
    // UPDATE PAYMENT
    // =========================================

    @Override
    public PaymentEntity updatePayment(
            Long paymentId,
            PaymentEntity payment
    ) {

        PaymentEntity existingPayment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        /*
         * Copy the fields from the request.
         *
         * IMPORTANT:
         * Keep paymentId from the existing entity.
         */

        existingPayment.setPaymentMethod(
                payment.getPaymentMethod()
        );

        existingPayment.setPaymentStatus(
                payment.getPaymentStatus()
        );

        existingPayment.setAmount(
                payment.getAmount()
        );

        existingPayment.setTransactionId(
                payment.getTransactionId()
        );

        return paymentRepository.save(existingPayment);
    }

    // =========================================
    // DELETE PAYMENT
    // =========================================

    @Override
    public void deletePayment(Long paymentId) {

        PaymentEntity existingPayment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with id: "
                                                + paymentId
                                )
                        );

        paymentRepository.delete(existingPayment);
    }
}
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

    @Override
    public PaymentEntity createPayment(PaymentEntity payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<PaymentEntity> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public PaymentEntity getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public PaymentEntity updatePayment(Long paymentId, PaymentEntity payment) {

        PaymentEntity existingPayment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        existingPayment.setPaymentStatus(payment.getPaymentStatus());
        existingPayment.setPaymentMethod(payment.getPaymentMethod());
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setOrder(payment.getOrder());

        return paymentRepository.save(existingPayment);
    }

    @Override
    public void deletePayment(Long paymentId) {
        paymentRepository.deleteById(paymentId);
    }

}
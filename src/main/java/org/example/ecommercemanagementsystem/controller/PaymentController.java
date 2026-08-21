package org.example.ecommercemanagementsystem.controller;

import lombok.RequiredArgsConstructor;
import org.example.ecommercemanagementsystem.entity.PaymentEntity;
import org.example.ecommercemanagementsystem.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


    @PostMapping("/create")
    public PaymentEntity createPayment(@RequestBody PaymentEntity payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping("/get/{id}")
    public PaymentEntity getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/getAll")
    public List<PaymentEntity> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @PutMapping("/update/{id}")
    public PaymentEntity updatePayment(@PathVariable Long id,
                                       @RequestBody PaymentEntity payment) {
        return paymentService.updatePayment(id, payment);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
    }
}
package com.universityweb.payment.service;

import com.universityweb.common.request.GetByUsernameRequest;
import com.universityweb.payment.request.GetPaymentsByUsernameAndStatusRequest;
import com.universityweb.payment.request.PaymentRequest;
import com.universityweb.payment.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PaymentService {
    String createPayment(PaymentRequest paymentRequest);
    PaymentResponse processPaymentResult(HttpServletRequest req, Map<String, String> params);
    Page<PaymentResponse> getPaymentsByUsername(GetByUsernameRequest request);
    Page<PaymentResponse> getPaymentsByUsernameAndStatus(GetPaymentsByUsernameAndStatusRequest request);
}

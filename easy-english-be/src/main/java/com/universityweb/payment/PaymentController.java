package com.universityweb.payment;

import com.universityweb.common.auth.service.auth.AuthService;
import com.universityweb.common.request.GetByUsernameRequest;
import com.universityweb.payment.entity.Payment;
import com.universityweb.payment.request.GetPaymentsByUsernameAndStatusRequest;
import com.universityweb.payment.request.PaymentRequest;
import com.universityweb.payment.response.PaymentResponse;
import com.universityweb.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Tag(name = "Payment")
public class PaymentController {

    private static final Logger log = LogManager.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final AuthService authService;

    @PostMapping("/create-payment")
    public ResponseEntity<String> createPayment(
            @RequestBody PaymentRequest paymentRequest
    ) {
        log.info("Received createPayment request: {}", paymentRequest);
        String paymentUrl = paymentService.createPayment(paymentRequest);
        log.info("Payment URL generated: {}", paymentUrl);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentUrl);
    }

    @PutMapping("/result")
    public ResponseEntity<PaymentResponse> handlePaymentResult(
            HttpServletRequest req,
            @RequestParam Map<String, String> params
    ) {
        log.info("Received payment result with params: {}", params);
        PaymentResponse paymentResponse = paymentService.processPaymentResult(req, params);
        log.info("Processed payment result successfully: {}", paymentResponse);
        return ResponseEntity.ok(paymentResponse);
    }

    @GetMapping("/")
    public ResponseEntity<Page<PaymentResponse>> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String username = authService.getCurrentUsername();
        log.info("Fetching payments for user: {}", username);
        GetByUsernameRequest request = new GetByUsernameRequest(page, size, username);
        Page<PaymentResponse> payments = paymentService.getPaymentsByUsername(request);
        log.info("Payments found for user {}: {}", username, payments);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByStatus(
            @PathVariable Payment.EStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String username = authService.getCurrentUsername();
        log.info("Received request to get payments by status: {}", status);
        GetPaymentsByUsernameAndStatusRequest request = new GetPaymentsByUsernameAndStatusRequest(page, size, username, status);
        Page<PaymentResponse> payments = paymentService.getPaymentsByUsernameAndStatus(request);
        return ResponseEntity.ok(payments);
    }
}

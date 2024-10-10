package com.universityweb.payment.response;

import com.universityweb.common.customenum.ECurrency;
import com.universityweb.payment.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Payment.EStatus status,
        Payment.EMethod method,
        LocalDateTime paymentTime,
        Long transactionNo,
        BigDecimal amountPaid,
        ECurrency currency,
        String username
) {}

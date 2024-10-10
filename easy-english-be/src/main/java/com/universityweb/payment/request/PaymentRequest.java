package com.universityweb.payment.request;

import com.universityweb.payment.entity.Payment;
import io.swagger.v3.oas.annotations.media.Schema;

public record PaymentRequest(
        @Schema(description = "The username of user.",
                example = "vanan")
        String username,

        @Schema(description = "The payment method used for the transaction.",
                example = "VN_PAY")
        Payment.EMethod method,

        @Schema(description = "The URL to which the user will be redirected after payment.",
                example = "https://example.com/return")
        String urlReturn
) {}

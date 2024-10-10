package com.universityweb.payment.request;

import com.universityweb.common.request.GetByUsernameRequest;
import com.universityweb.payment.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetPaymentsByUsernameAndStatusRequest extends GetByUsernameRequest {
    private Payment.EStatus status;

    public GetPaymentsByUsernameAndStatusRequest(int page, int size, String username, Payment.EStatus status) {
        super(page, size, username);
        this.status = status;
    }
}

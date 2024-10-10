package com.universityweb.payment.entity;

import com.universityweb.common.customenum.ECurrency;
import com.universityweb.order.entity.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EStatus status;

    @Enumerated(EnumType.STRING)
    private EMethod method;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "transaction_no")
    private Long transactionNo;

    @Column(name = "amount_paid")
    private BigDecimal amountPaid;

    @Enumerated(EnumType.STRING)
    private ECurrency currency;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    public enum EStatus {
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }

    public enum EMethod {
        VN_PAY
    }
}

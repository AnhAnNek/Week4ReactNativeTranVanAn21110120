package com.universityweb.payment;

import com.universityweb.payment.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepos extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p JOIN Order o ON p.order.id = o.id WHERE o.user.username = :username")
    Page<Payment> findByUsername(String username, Pageable pageable);

    @Query("SELECT p FROM Payment p JOIN Order o ON p.order.id = o.id WHERE o.user.username = :username AND p.status = :status")
    Page<Payment> findByUsernameAndStatus(String username, Payment.EStatus status, Pageable pageable);
}

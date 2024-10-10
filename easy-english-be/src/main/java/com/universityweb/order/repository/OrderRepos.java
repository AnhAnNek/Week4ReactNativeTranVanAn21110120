package com.universityweb.order.repository;

import com.universityweb.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepos extends JpaRepository<Order, Long> {
    Page<Order> findByUserUsername(String username, Pageable pageable);

    Page<Order> findByUserUsernameAndStatus(String username, Order.EStatus status, Pageable pageable);
}

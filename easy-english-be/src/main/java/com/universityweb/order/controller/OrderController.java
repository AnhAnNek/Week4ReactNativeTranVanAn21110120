package com.universityweb.order.controller;

import com.universityweb.order.dto.OrderDTO;
import com.universityweb.order.dto.OrderItemDTO;
import com.universityweb.order.entity.Order;
import com.universityweb.order.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order")
public class OrderController {

    private static final Logger log = LogManager.getLogger(OrderController.class);

    private final OrderService orderService;

    @GetMapping("/{username}")
    public ResponseEntity<Page<OrderDTO>> getOrders(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching orders page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDTO> orders = orderService.getOrders(username, null, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{username}/status/{status}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByStatus(
            @PathVariable String username,
            @PathVariable Order.EStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching orders with status: {}, page: {}, size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDTO> orders = orderService.getOrders(username, status, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<Page<OrderItemDTO>> getOrderItemsByOrderId(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching items for order ID: {}, page: {}, size: {}", orderId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderItemDTO> orderItems = orderService.getOrderItems(orderId, pageable);
        return ResponseEntity.ok(orderItems);
    }
}

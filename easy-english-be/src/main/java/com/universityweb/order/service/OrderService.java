package com.universityweb.order.service;

import com.universityweb.order.dto.OrderDTO;
import com.universityweb.order.dto.OrderItemDTO;
import com.universityweb.order.entity.Order;
import com.universityweb.order.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Order createOrderFromUserCart(String username);
    OrderDTO updateOrder(OrderDTO orderDTO);
    Page<OrderDTO> getOrders(String username, Order.EStatus status, Pageable pageable);
    Order getOrderEntityById(Long orderId);
    OrderDTO getOrderById(Long orderId);


    OrderItemDTO getOrderItem(Long orderItemId);
    Page<OrderItemDTO> getOrderItems(Long orderItemId, Pageable pageable);
    OrderItem getOrderItemEntityById(Long orderItemId);
}

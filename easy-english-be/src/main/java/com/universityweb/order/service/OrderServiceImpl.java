package com.universityweb.order.service;

import com.universityweb.cart.entity.Cart;
import com.universityweb.cart.entity.CartItem;
import com.universityweb.cart.service.CartService;
import com.universityweb.common.auth.entity.User;
import com.universityweb.common.customenum.ECurrency;
import com.universityweb.course.model.Course;
import com.universityweb.order.dto.OrderDTO;
import com.universityweb.order.dto.OrderItemDTO;
import com.universityweb.order.entity.Order;
import com.universityweb.order.entity.OrderItem;
import com.universityweb.order.exception.OrderItemNotFoundException;
import com.universityweb.order.exception.OrderNotFoundException;
import com.universityweb.order.mapper.OrderMapper;
import com.universityweb.order.repository.OrderItemRepos;
import com.universityweb.order.repository.OrderRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final OrderMapper orderMapper = OrderMapper.INSTANCE;

    @Autowired
    private OrderRepos orderRepos;

    @Autowired
    private OrderItemRepos orderItemRepos;

    @Autowired
    private CartService cartService;

    @Override
    public Order createOrderFromUserCart(String username) {
        Cart cart = cartService.getCartEntityByUsername(username);
        User user = cart.getUser();

        BigDecimal totalAmount = cartService.getTotalAmountOfCart(username);

        Order order = Order.builder()
                .totalAmount(totalAmount)
                .currency(ECurrency.VND)
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .status(Order.EStatus.PENDING_PAYMENT)
                .user(user)
                .build();

        Order savedOrder = orderRepos.save(order);

        List<Long> cartItemIdsToRemove = cart.getItems().stream()
                .map(CartItem::getId)
                .toList();

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    Course course = cartItem.getCourse();
                    return OrderItem.builder()
                            .price(cartItem.getPrice())
                            .discountPercent(cartItem.getDiscountPercent())
                            .course(course)
                            .order(savedOrder)
                            .build();
                })
                .toList();

        cartItemIdsToRemove.forEach(cartService::removeItemFromCart);
        orderItemRepos.saveAll(orderItems);
        return savedOrder;
    }

    @Override
    public OrderDTO updateOrder(OrderDTO orderDTO) {
        Order existingOrder = getOrderEntityById(orderDTO.getId());

        existingOrder.setTotalAmount(orderDTO.getTotalAmount());
        existingOrder.setCurrency(orderDTO.getCurrency());
        existingOrder.setUpdatedAt(LocalDateTime.now());
        existingOrder.setStatus(orderDTO.getStatus());

        Order updatedOrder = orderRepos.save(existingOrder);
        return orderMapper.toOrderDTO(updatedOrder);
    }

    @Override
    public Page<OrderDTO> getOrders(String username, Order.EStatus status, Pageable pageable) {
        Page<Order> orders;
        if (status == null) {
            orders = orderRepos.findByUserUsername(username, pageable);
        } else {
            orders = orderRepos.findByUserUsernameAndStatus(username, status, pageable);
        }
        return orders.map(orderMapper::toOrderDTO);
    }

    @Override
    public Order getOrderEntityById(Long orderId) {
        return orderRepos.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = getOrderEntityById(orderId);
        return orderMapper.toOrderDTO(order);
    }

    @Override
    public OrderItemDTO getOrderItem(Long orderItemId) {
        OrderItem orderItem = getOrderItemEntityById(orderItemId);

        return orderMapper.toOrderItemDTO(orderItem);
    }

    @Override
    public Page<OrderItemDTO> getOrderItems(Long orderId, Pageable pageable) {
        Page<OrderItem> orderItems = orderItemRepos.findByOrderId(orderId, pageable);
        return orderItems.map(orderMapper::toOrderItemDTO);
    }

    @Override
    public OrderItem getOrderItemEntityById(Long orderItemId) {
        return orderItemRepos.findById(orderItemId)
                .orElseThrow(() -> new OrderItemNotFoundException("Order item not found with ID: " + orderItemId));
    }
}

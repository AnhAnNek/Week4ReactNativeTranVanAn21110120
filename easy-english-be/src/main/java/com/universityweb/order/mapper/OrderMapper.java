package com.universityweb.order.mapper;

import com.universityweb.order.dto.OrderDTO;
import com.universityweb.order.dto.OrderItemDTO;
import com.universityweb.order.entity.Order;
import com.universityweb.order.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(source = "user.username", target = "username")
    OrderDTO toOrderDTO(Order entity);
    List<OrderDTO> toOrderDTOs(List<Order> entities);

    @Mapping(target = "user", ignore = true)
    Order toOrder(OrderDTO dto);
    List<Order> toOrders(List<OrderDTO> dtos);

    @Mapping(source = "order.id", target = "orderId")
    OrderItemDTO toOrderItemDTO(OrderItem entity);
    List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> entities);
    OrderItem toOrderItem(OrderItemDTO dto);
    List<OrderItem> toOrderItems(List<OrderItemDTO> dtos);
}

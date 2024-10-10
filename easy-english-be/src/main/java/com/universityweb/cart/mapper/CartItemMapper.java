package com.universityweb.cart.mapper;

import com.universityweb.cart.entity.CartItem;
import com.universityweb.cart.response.CartItemResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    CartItemMapper INSTANCE = Mappers.getMapper(CartItemMapper.class);

    @Mapping(source = "cart.id", target = "cartId")
    CartItemResponse toDTO(CartItem cartItem);

    List<CartItemResponse> toDTOs(List<CartItem> cartItems);

    CartItem toEntity(CartItemResponse cartItemDTO);

    List<CartItem> toEntities(List<CartItemResponse> cartItemDTOs);
}

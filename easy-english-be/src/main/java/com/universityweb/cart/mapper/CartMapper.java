package com.universityweb.cart.mapper;

import com.universityweb.cart.entity.Cart;
import com.universityweb.cart.response.CartResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartMapper INSTANCE = Mappers.getMapper(CartMapper.class);

    @Mapping(source = "user.username", target = "username")
    CartResponse toDTO(Cart entity);

    List<CartResponse> toDTOs(List<Cart> entities);

    Cart toEntity(CartResponse dto);

    List<Cart> toEntities(List<CartResponse> dtos);
}

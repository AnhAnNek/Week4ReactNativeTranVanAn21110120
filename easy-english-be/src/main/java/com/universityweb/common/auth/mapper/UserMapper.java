package com.universityweb.common.auth.mapper;

import com.universityweb.common.auth.dto.UserDTO;
import com.universityweb.common.auth.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);

    List<UserDTO> toDTOs(List<User> users);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "status", ignore = true)
    User toEntity(UserDTO userDTO);

    List<User> toEntities(List<UserDTO> userDTOs);
}

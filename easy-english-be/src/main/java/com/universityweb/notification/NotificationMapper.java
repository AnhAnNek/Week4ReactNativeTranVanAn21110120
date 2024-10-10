package com.universityweb.notification;

import com.universityweb.notification.entity.Notification;
import com.universityweb.notification.response.NotificationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    @Mapping(source = "user.username", target = "username")
    NotificationResponse toDTO(Notification notification);

    List<NotificationResponse> toDTOs(List<Notification> notifications);

    @Mapping(target = "user", ignore = true)
    Notification toEntity(NotificationResponse notificationDTO);

    List<Notification> toEntities(List<NotificationResponse> notificationDTOs);
}

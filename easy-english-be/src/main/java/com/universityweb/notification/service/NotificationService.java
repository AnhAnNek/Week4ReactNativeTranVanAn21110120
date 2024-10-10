package com.universityweb.notification.service;

import com.universityweb.common.auth.entity.User;
import com.universityweb.common.request.GetByUsernameRequest;
import com.universityweb.notification.response.NotificationResponse;
import com.universityweb.notification.request.SendNotificationRequest;
import org.springframework.data.domain.Page;

public interface NotificationService {
    Page<NotificationResponse> getNotificationsByUsername(GetByUsernameRequest request);
    NotificationResponse send(SendNotificationRequest request);
    NotificationResponse markAsRead(Long notificationId);
    User getUserByNotificationId(Long notificationId);
}

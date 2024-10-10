package com.universityweb.notification.request;

public record SendNotificationRequest(
        String message,
        String username
) {}

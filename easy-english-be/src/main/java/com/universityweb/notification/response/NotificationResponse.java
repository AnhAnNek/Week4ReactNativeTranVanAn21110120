package com.universityweb.notification.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationResponse {
    private Long id;

    private String message;

    private LocalDateTime createdDate;

    private boolean read;

    private String username;
}

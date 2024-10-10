package com.universityweb.notification.entity;

import com.universityweb.common.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String message;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    private boolean read;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;
}

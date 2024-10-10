package com.universityweb.course.model.response;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonResponse {
    private Long id;
    private String title;
    private String type;
    private String content;
    private String contentUrl;
    private String description;
    private int duration;
    private Boolean isPreview;
    private LocalDateTime startDate;
    private LocalDateTime createdAt;
    private String createdBy;
}

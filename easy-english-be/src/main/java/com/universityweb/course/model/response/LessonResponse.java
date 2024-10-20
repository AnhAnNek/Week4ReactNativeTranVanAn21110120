package com.universityweb.course.model.response;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalDateTime createdAt;
    private String createdBy;
}

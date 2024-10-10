package com.universityweb.course.model.request;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonRequest {
    private Long id;

    private Long sectionId;

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

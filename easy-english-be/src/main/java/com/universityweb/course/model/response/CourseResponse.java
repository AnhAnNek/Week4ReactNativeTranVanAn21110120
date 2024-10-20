package com.universityweb.course.model.response;

import jakarta.persistence.Column;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {
    private Long id;
    private List<Long> categoryIds;
    private Long levelId;
    private Long topicId;
    private String title;
    private String category;
    //private String level;
    private String imagePreview;
    private String videoPreview;
    private String descriptionPreview;
    private String description;
    private int duration;
    private int countView;
    private Boolean isPublish;
    private double progress;
    //private String createdBy;
    private double rating;
    private double ratingCount;
    private BigDecimal realPrice;
    private String teacher;
    private String createdAt;
    private Boolean isActive;
}

package com.universityweb.course.model.request;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.universityweb.course.model.Review;
import com.universityweb.course.model.Section;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
    private Long id;
    private String title;
    private List<Long> categoryIds;
    private Long levelId;
    private Long topicId;
    private String imagePreview;
    private String videoPreview;
    private String descriptionPreview;
    private String description;
    private int duration;
    private int countView;
    private Boolean isPublish;
    private String createdBy;
    private String createdAt;
    private Boolean isActive;
    private int pageNumber = 0;
    private int size = 10;
}

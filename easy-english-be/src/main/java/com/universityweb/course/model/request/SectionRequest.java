package com.universityweb.course.model.request;

import com.universityweb.course.model.Lesson;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionRequest {
    private Long id;
    private Long courseId;
    private String title;
    private String createdBy;
    private String createdAt;
    private int pageNumber = 0;
    private int size = 10;
}

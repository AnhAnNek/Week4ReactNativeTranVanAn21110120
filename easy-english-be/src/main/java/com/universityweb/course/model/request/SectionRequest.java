package com.universityweb.course.model.request;

import com.universityweb.course.model.Lesson;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionRequest {
    private int courseId;
    private String title;
    private List<Lesson> lessons;
    private String createdBy;
    private String createdAt;
}

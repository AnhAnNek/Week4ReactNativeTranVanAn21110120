package com.universityweb.course.model.response;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponse {

    private int id;

    private String title;

    private String category;

    private String level;

    private String imageUrl;

    private int duration;

    private String description;

    private Boolean isPublish;

    private String createdBy;

    private String createdAt;

    private List<SectionResponse> sectionResponses;
}

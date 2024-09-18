package com.universityweb.course.model.response;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionResponse {

    private int id;

    private String title;

    private String createdBy;

    private String createdAt;

    private List<LessonResponse> lessonResponses;

}

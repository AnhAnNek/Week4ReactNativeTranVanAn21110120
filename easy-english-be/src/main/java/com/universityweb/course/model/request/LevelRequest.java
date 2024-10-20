package com.universityweb.course.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelRequest {
    private Long id;
    private String name;
    private Long topicId;
    private String fromLevel;
    private String toLevel;
}

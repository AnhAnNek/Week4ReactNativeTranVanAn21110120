package com.universityweb.course.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQRequest {
    private Long id;
    private Long courseId;
    private String question;
    private String answer;
}

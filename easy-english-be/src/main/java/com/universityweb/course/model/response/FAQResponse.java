package com.universityweb.course.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQResponse {
    private Long id;
    private String question;
    private String answer;
}

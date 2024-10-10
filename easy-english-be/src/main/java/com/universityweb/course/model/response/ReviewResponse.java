package com.universityweb.course.model.response;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private double rating;
    private String comment;
    private String owner;
}

package com.universityweb.course.model.response;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.universityweb.course.model.Lesson;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionResponse {
    private Long id;
    private String title;
    private String createdBy;
    private String createdAt;

}

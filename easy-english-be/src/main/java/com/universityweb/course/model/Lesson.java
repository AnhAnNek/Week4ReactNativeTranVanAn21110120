package com.universityweb.course.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.universityweb.course.model.Enum.LessonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @Enumerated(EnumType.STRING)
    private LessonType type;
    private String content;
    private String contentUrl;
    private String description;
    private int duration;
    private int ordinalNumber;
    @Column(name = "preview")
    private Boolean isPreview;
    private LocalDate startDate;
    private LocalTime startTime;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;
}

package com.universityweb.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "test_questions")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TestQuestion implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answers;

    @Column(name = "answer_key")
    private String answerKey;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private EType type;

    @ManyToOne
    @JoinColumn(name = "test_section_id")
    private TestSection testSection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reading_passage_id")
    private ReadingPassage readingPassage;

    public enum EType {
        SINGLE_CHOICE,
        MULTIPLE_CHOICE,
        MATCHING,
        FILL_BLANK
    }
}

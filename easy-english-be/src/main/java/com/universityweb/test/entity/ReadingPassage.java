package com.universityweb.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "reading_passages")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ReadingPassage implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @OneToMany(mappedBy = "readingPassage", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestQuestion> questions;
}

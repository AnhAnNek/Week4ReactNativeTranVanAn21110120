package com.universityweb.test.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "test_sections")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TestSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @OneToMany(mappedBy = "testSection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestQuestion> questions;
}

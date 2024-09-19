package com.universityweb.course.repository;

import com.universityweb.course.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<Section, Integer> {
    Section findById(int id);
}

package com.universityweb.course.repository;

import com.universityweb.course.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FAQRepository extends JpaRepository<FAQ, Long> {
    List<FAQ> findByCourseId(Long courseId);
}

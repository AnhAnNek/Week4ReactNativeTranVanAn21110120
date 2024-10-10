package com.universityweb.course.repository;

import com.universityweb.course.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);

    Page<Course> findByPriceGreaterThanAndTitleContaining(int price, String title, Pageable pageable);

    Page<Course> findByCreatedBy(String createdBy, Pageable pageable);

    Page<Course> findByIsActiveAndCreatedBy(Boolean isActive,String createdBy, Pageable pageable);
}

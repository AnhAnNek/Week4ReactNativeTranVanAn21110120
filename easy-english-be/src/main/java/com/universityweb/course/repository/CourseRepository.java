package com.universityweb.course.repository;

import com.universityweb.common.auth.entity.User;
import com.universityweb.course.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);

    Page<Course> findByPriceGreaterThanAndTitleContaining(int price, String title, Pageable pageable);

    Page<Course> findByCreatedBy(String createdBy, Pageable pageable);

    Page<Course> findByIsActiveAndCreatedBy(Boolean isActive, User user, Pageable pageable);

    Page<Course> findByIsActiveAndCategoriesId(boolean b, Long categoryId, Pageable pageable);

    Page<Course> findByIsActiveAndTopicId(boolean b, Long topicId, Pageable pageable);

    Page<Course> findByIsActiveAndLevelId(boolean b, Long levelId, Pageable pageable);

    Page<Course> findByIsActive(boolean b, Pageable pageable);

    List<Course> findByCreatedByNot(User user);
}

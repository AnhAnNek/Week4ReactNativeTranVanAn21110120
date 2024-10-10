package com.universityweb.course.repository;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PriceRepository extends JpaRepository<Price, Long> {
    Optional<Price> findByCourse(Course course);
}

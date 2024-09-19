package com.universityweb.course.enrollment.service;

import com.universityweb.course.model.Course;

import java.util.List;

public interface EnrollmentService {
    Long countSalesByCourseId(Long courseId);
    List<Course> findTop10CoursesBySales();
}

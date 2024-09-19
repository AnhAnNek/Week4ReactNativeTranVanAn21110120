package com.universityweb.course.enrollment.service;

import com.universityweb.course.enrollment.EnrollmentRepos;
import com.universityweb.course.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {
    @Autowired
    private EnrollmentRepos enrollmentRepos;

    @Override
    public Long countSalesByCourseId(Long courseId) {
        return enrollmentRepos.countSalesByCourseId(courseId);
    }

    @Override
    public List<Course> findTop10CoursesBySales() {
        return enrollmentRepos.findTop10CoursesBySales();
    }
}

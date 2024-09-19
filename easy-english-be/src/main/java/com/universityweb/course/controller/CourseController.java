package com.universityweb.course.controller;

import com.universityweb.course.enrollment.service.EnrollmentService;
import com.universityweb.course.model.Course;
import com.universityweb.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/courses")
@RestController
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("")
    public ResponseEntity<List<Course>> getAllCourse() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping("")
    public ResponseEntity<?> newCourse(@RequestBody Course course) {
        courseService.newCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully");
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Course> > filterCourse(@RequestParam int price, @RequestParam String name) {
        return ResponseEntity.ok(courseService.filterCourse(price, name));
    }

    @GetMapping("/{courseId}/sales-count")
    public ResponseEntity<Long> getSalesCountForCourse(@PathVariable Long courseId) {
        Long sales = enrollmentService.countSalesByCourseId(courseId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/top-10-sales")
    public ResponseEntity<List<Course>> getTop10CoursesBySales() {
        List<Course> courses = enrollmentService.findTop10CoursesBySales();
        return ResponseEntity.ok(courses);
    }
}

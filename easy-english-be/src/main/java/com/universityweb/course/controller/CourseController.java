package com.universityweb.course.controller;

import com.universityweb.course.enrollment.service.EnrollmentService;
import com.universityweb.course.model.Course;
import com.universityweb.course.model.request.CourseRequest;
import com.universityweb.course.model.response.CourseResponse;
import com.universityweb.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/v1/course")
@RestController
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private EnrollmentService enrollmentService;
    @PostMapping("/get-all-course-of-teacher")
    public ResponseEntity<Page<CourseResponse>> getAllCourseOfTeacher(@RequestBody CourseRequest courseRequest) {
        return ResponseEntity.ok(courseService.getAllCourseOfTeacher(courseRequest));
    }
    @PostMapping("/update-course")
    public ResponseEntity<String> updateCourse( @RequestBody CourseRequest courseRequest) {
        courseService.updateCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course updated successfully");
    }
    @PostMapping("/create-course")
    public ResponseEntity<String> createCourse(@RequestBody CourseRequest courseRequest) {
        courseService.createCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully");
    }
    @PostMapping("/delete-course")
    public ResponseEntity<String> deleteCourse(@RequestBody CourseRequest courseRequest) {
        courseService.deleteCourse(courseRequest);
        return ResponseEntity.status(HttpStatus.OK).body("Course deleted successfully");
    }
    @PostMapping("/get-main-course")
    public ResponseEntity<CourseResponse> getMainCourse(@RequestBody CourseRequest courseRequest) {
        return ResponseEntity.ok( courseService.getMainCourse(courseRequest));
    }
    @GetMapping("")
    public ResponseEntity<List<Course>> getAllCourse() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Course>> filterCourse(@RequestParam int price, @RequestParam String name) {
        return ResponseEntity.ok(courseService.filterCourse(price, name));
    }

    @GetMapping("/{courseId}/sales-count")
    public ResponseEntity<Long> getSalesCountForCourse(@PathVariable Long courseId) {
        Long sales = enrollmentService.countSalesByCourseId(courseId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/top-10-sales")
    public ResponseEntity<List<Course>> getTop10CoursesBySales() {
        List<Course> courses = courseService.getTop10Courses();
        return ResponseEntity.ok(courses);
    }
}

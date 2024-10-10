package com.universityweb.course.service;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.Price;
import com.universityweb.course.model.request.CourseRequest;
import com.universityweb.course.model.response.CourseResponse;
import com.universityweb.course.repository.CourseRepository;
import com.universityweb.course.repository.PriceRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PriceRepository priceRepository;

    public Page<CourseResponse> getAllCourseOfTeacher(CourseRequest courseRequest) {
        String createdBy = courseRequest.getCreatedBy();
        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActiveAndCreatedBy(true,createdBy, pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public void updateCourse(CourseRequest courseRequest) {
        Course currentCourse = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        BeanUtils.copyProperties(courseRequest, currentCourse, "id", "createdAt", "createdBy");
        courseRepository.save(currentCourse);
    }

    public void createCourse(CourseRequest courseRequest) {
        Course course = new Course();
        Price price = new Price();
        BeanUtils.copyProperties(courseRequest, course, "id", "createdAt");
        price.setPrice(BigDecimal.valueOf(0));
        price.setSalePrice(BigDecimal.valueOf(0));
        course.setPrice(price);
        price.setCourse(course);
        courseRepository.save(course);
    }

    public void deleteCourse(CourseRequest courseRequest) {
        Course currentCourse = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        currentCourse.setIsActive(false);
        courseRepository.save(currentCourse);
    }

    public CourseResponse getMainCourse(CourseRequest courseRequest) {
        Course course = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseResponse courseResponse = new CourseResponse();
        BeanUtils.copyProperties(course, courseResponse);
        return courseResponse;
    }

    public Course getCourseById(Long courseId) {
        String msg = "Could not find any course with id=" + courseId;
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException(msg));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> filterCourse(int price, String name) {
        return courseRepository.findAll();
    }

    public List<Course> getTop10Courses() {
        return courseRepository.findAll();
    }
}

package com.universityweb.course.service;

import com.universityweb.course.model.Course;
import com.universityweb.course.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;


    /*public void copy(Course course, CourseResponse courseResponse) {
        courseResponse.setId(course.getId());
        courseResponse.setTitle(course.getTitle());
        courseResponse.setCategory(course.getCategory());
        courseResponse.setLevel(course.getLevel());
        courseResponse.setImageUrl(course.getImageUrl());
        courseResponse.setDuration(course.getDuration());
        courseResponse.setDescription(course.getDescription());
        courseResponse.setIsPublish(course.getIsPublish());
        courseResponse.setCreatedBy(course.getCreatedBy());
        courseResponse.setCreatedAt(course.getCreatedAt());
        List<SectionResponse> sectionResponses = course.getSections().stream()
                .map(section -> {
                    SectionResponse sectionResponse = new SectionResponse();
                    sectionService.copy(section, sectionResponse);
                    return sectionResponse;
                })
                .collect(Collectors.toList());
        courseResponse.setSectionResponses(sectionResponses);
    }*/


    public void deleteCourse(int id) {
        courseRepository.deleteById(id);
    }

    public void newCourse(Course course) {
        courseRepository.save(course);
    }

    public void updateCourse(Course course) {
        courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    /*public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(course -> {
                    CourseResponse courseResponse = new CourseResponse();
                    copy(course, courseResponse);
                    return courseResponse;
                })
                .collect(Collectors.toList());
    }*/

    public Course getCourseById(int id) {
        return courseRepository.findById(id);
    }

    public List<Course> filterCourse(int price, String name) {
        return courseRepository.findByPriceGreaterThanAndTitleContaining(price, name);
    }
}

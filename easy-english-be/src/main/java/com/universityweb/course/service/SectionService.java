package com.universityweb.course.service;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.Section;
import com.universityweb.course.model.request.SectionRequest;
import com.universityweb.course.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {
    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private CourseService courseService;


    /*public void copy(Section section, SectionResponse sectionResponse) {
        sectionResponse.setId(section.getId());
        sectionResponse.setTitle(section.getTitle());
        sectionResponse.setCreatedBy(section.getCreatedBy());
        sectionResponse.setCreatedAt(section.getCreatedAt());

        List<LessonResponse> lessonResponses = section.getLessons().stream()
                .map(lesson -> {
                    LessonResponse lessonResponse = new LessonResponse();
                    lessonService.copy(lesson, lessonResponse);
                    return lessonResponse;
                })
                .collect(Collectors.toList());
        sectionResponse.setLessonResponses(lessonResponses);
    }*/
    public void deleteSection(int id) {
        sectionRepository.deleteById(id);
    }

    public void newSection(SectionRequest sectionRequest) {
        Section section = new Section();
        Course course = courseService.getCourseById(sectionRequest.getCourseId());
        section.setCourse(course);
        section.setTitle(sectionRequest.getTitle());
        section.setCreatedBy(sectionRequest.getCreatedBy());
        sectionRepository.save(section);
    }

    public void updateSection(Section section) {
        sectionRepository.save(section);
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public Section getSectionById(int id) {
        return sectionRepository.findById(id);
    }
}

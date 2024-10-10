package com.universityweb.course.service;


import com.universityweb.course.model.Lesson;
import com.universityweb.course.model.Section;
import com.universityweb.course.model.request.LessonRequest;
import com.universityweb.course.model.response.LessonResponse;
import com.universityweb.course.repository.LessonRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private SectionService sectionService;

    public List<LessonResponse> getAllLessonBySection(LessonRequest lessonRequest) {
        List<Lesson> lessons = lessonRepository.findBySectionId(lessonRequest.getSectionId());
        List<LessonResponse> lessonResponses = new ArrayList<>();
        for (Lesson lesson : lessons) {
            LessonResponse lessonResponse = new LessonResponse();
            BeanUtils.copyProperties(lesson, lessonResponse);
            lessonResponses.add(lessonResponse);
        }
        return lessonResponses;
    }

    public void createLesson(LessonRequest lessonRequest) {
        Lesson lesson = new Lesson();
        Optional<Section> sectionOptional = sectionService.getSectionById(lessonRequest.getSectionId());
        if (sectionOptional.isPresent()) {
            Section section = sectionOptional.get();
            lesson.setSection(section);
            BeanUtils.copyProperties(lessonRequest, lesson);
            lessonRepository.save(lesson);
        } else {
            throw new RuntimeException("Section not found");
        }
    }

    public void updateLesson(LessonRequest lessonRequest) {
        Optional<Lesson> currentLessonOptional = lessonRepository.findById(lessonRequest.getId());
        if (currentLessonOptional.isPresent()) {
            Lesson currentLesson = currentLessonOptional.get();
            BeanUtils.copyProperties(lessonRequest, currentLesson);
            lessonRepository.save(currentLesson);
        } else {
            throw new RuntimeException("Lesson not found");
        }
    }

    public void deleteLesson(LessonRequest lessonRequest) {
        lessonRepository.deleteById(lessonRequest.getId());
    }

    public LessonResponse getLessonById(LessonRequest lessonRequest) {
        Lesson lesson = lessonRepository.findById(lessonRequest.getId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonResponse lessonResponse = new LessonResponse();
        BeanUtils.copyProperties(lesson, lessonResponse);
        return lessonResponse;
    }
}

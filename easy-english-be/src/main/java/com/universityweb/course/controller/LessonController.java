package com.universityweb.course.controller;

import com.universityweb.course.model.Lesson;
import com.universityweb.course.model.request.LessonRequest;
import com.universityweb.course.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @GetMapping("/lessons")
    public List<Lesson> getAllLesson() {
        return lessonService.getAllLessons();
    }

    @PostMapping("/lessons")
    public String newLesson(@RequestBody LessonRequest lessonRequest) {
        lessonService.newLesson(lessonRequest);
        return "Lesson added successfully";
    }

}

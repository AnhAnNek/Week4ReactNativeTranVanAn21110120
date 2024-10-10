package com.universityweb.course.controller;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.Section;
import com.universityweb.course.model.request.SectionRequest;
import com.universityweb.course.model.response.SectionResponse;
import com.universityweb.course.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/v1/section")
@RestController
public class SectionController {
    @Autowired
    private SectionService sectionService;
    @PostMapping("/create-section")
    public String createSection(@RequestBody SectionRequest sectionRequest) {
        sectionService.createSection(sectionRequest);
        return "Section added successfully";
    }

    @PostMapping("/update-section")
    public String updateSection(@RequestBody SectionRequest sectionRequest) {
        sectionService.updateSection(sectionRequest);
        return "Section updated successfully";
    }
    @PostMapping("/delete-section")
    public String deleteSection(@RequestBody SectionRequest sectionRequest) {
        sectionService.deleteSection(sectionRequest);
        return "Section deleted successfully";
    }

    @PostMapping("/get-all-section-by-course")
    public ResponseEntity<List<SectionResponse>> getAllSectionByCourse(@RequestBody SectionRequest sectionRequest) {
        return ResponseEntity.ok(sectionService.getAllSectionByCourse(sectionRequest));
    }
}

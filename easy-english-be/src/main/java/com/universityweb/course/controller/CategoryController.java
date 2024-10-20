package com.universityweb.course.controller;

import com.universityweb.course.model.request.CategoryRequest;
import com.universityweb.course.model.request.CourseRequest;
import com.universityweb.course.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/api/v1/category")
@RestController
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @PostMapping("/create-category")
    public ResponseEntity<String> createCategory(@RequestBody CategoryRequest categoryRequest) {
        categoryService.createCategory(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category added successfully");
    }
    @PostMapping("/update-category")
    public ResponseEntity<String> updateCategory(@RequestBody CategoryRequest categoryRequest) {
        categoryService.updateCategory(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Category updated successfully");
    }
    @PostMapping("/get-all-category")
    public ResponseEntity<?> getAllCategory() {
        return ResponseEntity.ok(categoryService.getAllCategory());
    }
}

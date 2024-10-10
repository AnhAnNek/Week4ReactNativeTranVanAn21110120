package com.universityweb.course.controller;
import com.universityweb.course.model.request.ReviewRequest;
import com.universityweb.course.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/api/v1/review")
@RestController
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/create-review")
    public ResponseEntity<String> createReview(@RequestBody ReviewRequest reviewRequest) {
        reviewService.createReview(reviewRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Review added successfully");
    }
}

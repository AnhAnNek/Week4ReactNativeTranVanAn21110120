package com.universityweb.course.controller;
import com.universityweb.course.model.request.ReviewRequest;
import com.universityweb.course.model.response.ReviewResponse;
import com.universityweb.course.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/get-all-review-5-star-by-course")
    public ResponseEntity<List<ReviewResponse>> getReview5StarByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewStarByCourse(reviewRequest,5));
    }
    @PostMapping("/get-all-review-4-star-by-course")
    public ResponseEntity<List<ReviewResponse>> getReview4StarByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewStarByCourse(reviewRequest,4));
    }
    @PostMapping("/get-all-review-3-star-by-course")
    public ResponseEntity<List<ReviewResponse>> getReview3StarByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewStarByCourse(reviewRequest,3));
    }    @PostMapping("/get-all-review-2-star-by-course")
    public ResponseEntity<List<ReviewResponse>> getReview2StarByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewStarByCourse(reviewRequest,2));
    }
    @PostMapping("/get-all-review-1-star-by-course")
    public ResponseEntity<List<ReviewResponse>> getReview1StarByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewStarByCourse(reviewRequest,1));
    }

    @PostMapping("/get-all-review-by-course")
    public ResponseEntity<List<ReviewResponse>> getReviewByCourse(@RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok().body(reviewService.getReviewByCourse(reviewRequest));
    }

}

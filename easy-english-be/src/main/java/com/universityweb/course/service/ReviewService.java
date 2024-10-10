package com.universityweb.course.service;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.Review;
import com.universityweb.course.model.request.ReviewRequest;
import com.universityweb.course.repository.CourseRepository;
import com.universityweb.course.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CourseRepository courseRepository;

    public void createReview(ReviewRequest reviewRequest) {
        Review review = new Review();
        Optional<Course> courseOptional = courseRepository.findById(reviewRequest.getCourseId());

        if (courseOptional.isPresent()) {
            Course course = courseOptional.get();

            review.setCourse(course);
            review.setOwner(reviewRequest.getUser());
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment());

            reviewRepository.save(review);

            course.updateRating();
            courseRepository.save(course);
        } else {
            throw new RuntimeException("Course not found");
        }
    }
}

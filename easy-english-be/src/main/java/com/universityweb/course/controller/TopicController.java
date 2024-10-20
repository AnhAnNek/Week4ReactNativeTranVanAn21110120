package com.universityweb.course.controller;

import com.universityweb.course.model.request.CategoryRequest;
import com.universityweb.course.model.request.TopicRequest;
import com.universityweb.course.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/api/v1/topic")
@RestController
public class TopicController {

    @Autowired
    private TopicService topicService;
    @PostMapping("create-topic")
    public ResponseEntity<String> createTopic(@RequestBody TopicRequest topicRequest) {
        topicService.createTopic(topicRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Topic added successfully");
    }

    @PostMapping("update-topic")
    public ResponseEntity<String> updateTopic(@RequestBody TopicRequest topicRequest) {
        topicService.updateTopic(topicRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Topic updated successfully");
    }

    @PostMapping("get-all-topic")
    public ResponseEntity<?> getAllTopic() {
        return ResponseEntity.ok(topicService.getAllTopic());
    }
}

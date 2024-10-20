package com.universityweb.course.service;

import com.universityweb.course.model.Topic;
import com.universityweb.course.model.request.TopicRequest;
import com.universityweb.course.model.response.TopicResponse;
import com.universityweb.course.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    public void createTopic(TopicRequest topicRequest) {
        Topic topic = new Topic();
        topic.setName(topicRequest.getName());
        topicRepository.save(topic);
    }
    public void updateTopic(TopicRequest topicRequest) {
        Topic currentTopic = topicRepository
                .findById(topicRequest.getId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        currentTopic.setName(topicRequest.getName());
        topicRepository.save(currentTopic);
    }

    public List<TopicResponse> getAllTopic() {
        List<Topic> topics = topicRepository.findAll();
        List<TopicResponse> topicResponses = new ArrayList<>();
        topics.forEach(topic -> {
            TopicResponse topicResponse = new TopicResponse();
            topicResponse.setId(topic.getId());
            topicResponse.setName(topic.getName());
            topicResponses.add(topicResponse);
        });
        return topicResponses;
    }

}

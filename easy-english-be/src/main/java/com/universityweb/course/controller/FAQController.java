package com.universityweb.course.controller;

import com.universityweb.course.model.request.FAQRequest;
import com.universityweb.course.model.request.SectionRequest;
import com.universityweb.course.model.response.FAQResponse;
import com.universityweb.course.model.response.SectionResponse;
import com.universityweb.course.service.FAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/v1/faq")
@RestController
public class FAQController {
    @Autowired
    private FAQService faqService;

    @PostMapping("/create-faq")
    public String createFAQ(@RequestBody FAQRequest faqRequest) {
        faqService.createFAQ(faqRequest);
        return "FAQ added successfully";
    }

    @PostMapping("/update-faq")
    public String updateFAQ(@RequestBody FAQRequest faqRequest) {
        faqService.updateFAQ(faqRequest);
        return "FAQ updated successfully";
    }
    @PostMapping("/delete-faq")
    public String deleteFAQ(@RequestBody FAQRequest faqRequest) {
        faqService.deleteFAQ(faqRequest);
        return "FAQ deleted successfully";
    }

    @PostMapping("/get-all-faq-by-course")
    public ResponseEntity<List<FAQResponse>> getAllFAQByCourse(@RequestBody FAQRequest faqRequest) {
        return ResponseEntity.ok(faqService.getAllFAQByCourse(faqRequest));
    }
}

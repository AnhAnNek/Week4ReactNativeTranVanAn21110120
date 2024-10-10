package com.universityweb.course.controller;

import com.universityweb.course.model.request.PriceRequest;
import com.universityweb.course.model.request.SectionRequest;
import com.universityweb.course.model.response.PriceResponse;
import com.universityweb.course.model.response.SectionResponse;
import com.universityweb.course.service.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/api/v1/price")
@RestController
public class PriceController {
    @Autowired
    private PriceService priceService;

    @PostMapping("/update-price")
    public String updatePrice(@RequestBody PriceRequest priceRequest) {
        priceService.updatePrice(priceRequest);
        return "Price updated successfully";
    }

    @PostMapping("/get-price-by-course")
    public ResponseEntity<PriceResponse> getPriceByCourse(@RequestBody PriceRequest priceRequest) {
        return ResponseEntity.ok(priceService.getPriceByCourse(priceRequest));
    }
}

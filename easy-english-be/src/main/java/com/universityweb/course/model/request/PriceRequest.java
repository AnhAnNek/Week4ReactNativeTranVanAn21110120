package com.universityweb.course.model.request;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceRequest {
    private Long id;
    private Long courseId;
    private BigDecimal price;
    private BigDecimal salePrice;
    private LocalDate startDate;
    private LocalDate  endDate;
    private Boolean isActive;

}

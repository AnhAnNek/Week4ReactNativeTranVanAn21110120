package com.universityweb.course.model.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceResponse {
    private Long id;
    private BigDecimal price;
    private BigDecimal salePrice;
    private LocalDate  startDate;
    private LocalDate endDate;
    private Boolean isActive;
}

package com.universityweb.cart.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    @Schema(description = "Cart ID", example = "1")
    private Long id;

    @Schema(description = "Total amount of items in the cart",
            example = "150.75")
    private BigDecimal totalAmount;

    @Schema(description = "The date and time when the cart was last updated",
            example = "2024-09-28T14:30:00")
    private LocalDateTime updatedAt;

    @Schema(description = "Username of the cart owner",
            example = "john_doe")
    private String username;

    @Schema(description = "List of items in the cart")
    private List<CartItemResponse> items;

    public BigDecimal getTotalAmount() {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItemResponse cartItemResponse : items) {
            BigDecimal itemPrice = cartItemResponse.getPrice();
            totalAmount = totalAmount.add(itemPrice);
        }
        return totalAmount;
    }
}

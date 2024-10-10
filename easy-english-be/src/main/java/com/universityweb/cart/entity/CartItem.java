package com.universityweb.cart.entity;

import com.universityweb.course.model.Course;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items", uniqueConstraints = {
        @UniqueConstraint(name = "UniqueCourseCard", columnNames = {"course_id", "cart_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    private EStatus status;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "discount_percent")
    private BigDecimal discountPercent;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    public enum EStatus {
        ACTIVE,
        OUT_OF_STOCK,
        DELETED,
        PAYMENT_PENDING,
        PAYMENT_COMPLETED
    }
}

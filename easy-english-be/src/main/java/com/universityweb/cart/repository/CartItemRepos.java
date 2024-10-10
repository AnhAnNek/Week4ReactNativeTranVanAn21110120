package com.universityweb.cart.repository;

import com.universityweb.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepos extends JpaRepository<CartItem, Long> {
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND (ci.status = 'ACTIVE' OR ci.status = 'OUT_OF_STOCK') " +
            "ORDER BY ci.updatedAt DESC")
    List<CartItem> findItemsByCartIdToDisplay(@Param("cartId") Long cartId);

    @Query("SELECT ci FROM CartItem ci WHERE ci.id = :cartId AND ci.status = :status ORDER BY ci.updatedAt DESC")
    List<CartItem> findByCartIdAndStatus(
            @Param("cartId") Long cartId,
            @Param("status") CartItem.EStatus status);

    @Query("SELECT ci FROM CartItem ci WHERE ci.id = :cardItemId AND (ci.status = 'ACTIVE' OR ci.status = 'OUT_OF_STOCK') ")
    Optional<CartItem> findByCartItemById(@Param("cardItemId") Long cardItemId);

    @Query("SELECT Count(ci) FROM CartItem ci WHERE ci.cart.id = :cartId AND (ci.status = 'ACTIVE' OR ci.status = 'OUT_OF_STOCK')")
    Integer countByCartId(Long cartId);
}

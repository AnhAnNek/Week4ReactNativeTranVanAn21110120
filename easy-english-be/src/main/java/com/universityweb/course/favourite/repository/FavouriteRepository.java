package com.universityweb.course.favourite.repository;

import com.universityweb.common.auth.entity.User;
import com.universityweb.course.favourite.model.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, Long>{
    List<Favourite> findByUser(User user);
}

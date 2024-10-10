package com.universityweb.course.mapper;

import com.universityweb.course.model.Course;
import com.universityweb.course.model.response.CourseResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);

    CourseResponse toDTO(Course entity);

    List<CourseResponse> toDTOs(List<Course> entities);

    @Mapping(target = "sections", ignore = true)
    Course toEntity(CourseResponse dto);

    List<Course> toEntities(List<CourseResponse> dtos);
}

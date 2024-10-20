package com.universityweb.course.service;

import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.repos.UserRepos;
import com.universityweb.course.enrollment.EnrollmentRepos;
import com.universityweb.course.enrollment.model.Enrollment;
import com.universityweb.course.favourite.model.Favourite;
import com.universityweb.course.favourite.repository.FavouriteRepository;
import com.universityweb.course.model.*;
import com.universityweb.course.model.request.CourseRequest;
import com.universityweb.course.model.response.CourseResponse;
import com.universityweb.course.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private EnrollmentRepos enrollmentRepos;
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private PriceRepository priceRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepos userRepos;

    public Page<CourseResponse> getAllCourseOfTeacher(CourseRequest courseRequest) {

        User user = userRepos.findByUsername(courseRequest.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActiveAndCreatedBy(true,user, pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public void updateCourse(CourseRequest courseRequest) {
        Course currentCourse = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        BeanUtils.copyProperties(courseRequest, currentCourse, "id", "createdAt", "createdBy");

        Level level = levelRepository.findById(courseRequest.getLevelId())
                .orElseThrow(() -> new RuntimeException("Level not found"));
        currentCourse.setLevel(level);
        Topic topic = topicRepository.findById(courseRequest.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        currentCourse.setTopic(topic);
        List<Category> categories = new ArrayList<>();
        for (Long categoryId : courseRequest.getCategoryIds()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            categories.add(category);
        }
        currentCourse.setCategories(categories);
        courseRepository.save(currentCourse);
    }

    public void createCourse(CourseRequest courseRequest) {
        Course course = new Course();
        Price price = new Price();
        BeanUtils.copyProperties(courseRequest, course, "id", "createdAt");
        price.setPrice(BigDecimal.valueOf(0));
        price.setSalePrice(BigDecimal.valueOf(0));
        course.setPrice(price);
        price.setCourse(course);

        Level level = levelRepository.findById(courseRequest.getLevelId())
                .orElseThrow(() -> new RuntimeException("Level not found"));
        course.setLevel(level);

        Topic topic = topicRepository.findById(courseRequest.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        course.setTopic(topic);

        List<Category> categories = new ArrayList<>();
        for (Long categoryId : courseRequest.getCategoryIds()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            categories.add(category);
        }
        course.setCategories(categories);

        User user = userRepos.findByUsername(courseRequest.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

        course.setCreatedBy(user);
        courseRepository.save(course);
    }

    public void deleteCourse(CourseRequest courseRequest) {
        Course currentCourse = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        currentCourse.setIsActive(false);
        courseRepository.save(currentCourse);
    }

    public CourseResponse getMainCourse(CourseRequest courseRequest) {
        Course course = courseRepository.findById(courseRequest.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseResponse courseResponse = new CourseResponse();
        BeanUtils.copyProperties(course, courseResponse);
        courseResponse.setTopicId(course.getTopic().getId());
        courseResponse.setLevelId(course.getLevel().getId());
        List<Long> categoryIds = new ArrayList<>();
        for (Category category : course.getCategories()) {
            categoryIds.add(category.getId());
        }
        courseResponse.setCategoryIds(categoryIds);
        return courseResponse;
    }

    public Course getCourseById(Long courseId) {
        String msg = "Could not find any course with id=" + courseId;
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException(msg));
    }
    public Page<CourseResponse> getAllCourseByTopic(CourseRequest courseRequest) {
        Long topicId = courseRequest.getTopicId();
        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActiveAndTopicId(true, topicId, pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public Page<CourseResponse> getAllCourseByLevel(CourseRequest courseRequest) {
        Long levelId = courseRequest.getLevelId();
        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActiveAndLevelId(true, levelId, pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public Page<CourseResponse> getAllCourseByListCategory(CourseRequest courseRequest) {
        List<Long> categoryIds = courseRequest.getCategoryIds();
        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActiveAndCategoriesId(true, categoryIds.get(0), pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public Page<CourseResponse> getAllCourse(CourseRequest courseRequest) {
        int pageNumber = courseRequest.getPageNumber();
        int size = courseRequest.getSize();

        Sort sort = Sort.by("createdAt");
        Pageable pageable = PageRequest.of(pageNumber, size, sort.descending());
        Page<Course> coursePage = courseRepository.findByIsActive(true,pageable);

        return coursePage.map(course -> {
            CourseResponse courseResponse = new CourseResponse();
            List<Review> reviews = reviewRepository.findByCourseId(course.getId());
            Price price = priceRepository.findByCourse(course)
                    .orElseThrow(() -> new RuntimeException("Price not found for course"));
            courseResponse.setRating(reviews.stream().mapToDouble(Review::getRating).average().orElse(0));
            courseResponse.setRatingCount(reviews.size());
            courseResponse.setRealPrice(price.getPrice());
            courseResponse.setTeacher(course.getCreatedBy().getUsername());
            BeanUtils.copyProperties(course, courseResponse);
            return courseResponse;
        });
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> filterCourse(int price, String name) {
        return courseRepository.findAll();
    }

    public List<Course> getTop10Courses() {
        return courseRepository.findAll();
    }


    public List<CourseResponse> getAllCourseOfStudent(CourseRequest courseRequest) {
        User user = userRepos.findByUsername(courseRequest.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Enrollment> enrollments = enrollmentRepos.findByUser(user);
        List<CourseResponse> courseResponses = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            CourseResponse courseResponse = new CourseResponse();
            BeanUtils.copyProperties(course, courseResponse);
            courseResponse.setProgress(enrollment.getProgress());
            courseResponse.setTeacher(course.getCreatedBy().getUsername());
            courseResponses.add(courseResponse);
        }
        return courseResponses;
    }

    public List<CourseResponse> getAllCourseNotOfStudent(CourseRequest courseRequest) {
        // Lấy thông tin User dựa trên username
        User user = userRepos.findByUsername(courseRequest.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy danh sách các khóa học mà User đã tham gia
        List<Enrollment> enrollments = enrollmentRepos.findByUser(user);

        // Tạo danh sách các khóa học mà User đã tham gia
        Set<Course> enrolledCourses = enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toSet());

        // Lấy tất cả các khóa học
        List<Course> allCourses = courseRepository.findAll();

        // Lọc những khóa học mà User chưa tham gia
        List<CourseResponse> courseResponses = new ArrayList<>();
        for (Course course : allCourses) {
            if (!enrolledCourses.contains(course)) {
                List<Review> reviews = reviewRepository.findByCourseId(course.getId());
                Price price = priceRepository.findByCourse(course)
                        .orElseThrow(() -> new RuntimeException("Price not found for course"));
                CourseResponse courseResponse = new CourseResponse();
                courseResponse.setRating(reviews.stream().mapToDouble(Review::getRating).average().orElse(0));
                courseResponse.setRatingCount(reviews.size());
                courseResponse.setRealPrice(price.getPrice());
                BeanUtils.copyProperties(course, courseResponse);
                courseResponse.setTeacher(course.getCreatedBy().getUsername());
                courseResponses.add(courseResponse);
            }
        }
        return courseResponses;
    }

    public List<CourseResponse> getAllCourseFavoriteOfStudent(CourseRequest courseRequest) {
        User user = userRepos.findByUsername(courseRequest.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Favourite> favourites = favouriteRepository.findByUser(user);
        List<CourseResponse> courseResponses = new ArrayList<>();
        for (Favourite favourite : favourites) {
            Course course = favourite.getCourse();
            List<Review> reviews = reviewRepository.findByCourseId(course.getId());
            Price price = priceRepository.findByCourse(course)
                    .orElseThrow(() -> new RuntimeException("Price not found for course"));
            CourseResponse courseResponse = new CourseResponse();
            courseResponse.setRating(reviews.stream().mapToDouble(Review::getRating).average().orElse(0));
            courseResponse.setRatingCount(reviews.size());
            courseResponse.setRealPrice(price.getPrice());
            BeanUtils.copyProperties(course, courseResponse);
            courseResponse.setTeacher(course.getCreatedBy().getUsername());
            courseResponses.add(courseResponse);
        }
        return courseResponses;
    }


}

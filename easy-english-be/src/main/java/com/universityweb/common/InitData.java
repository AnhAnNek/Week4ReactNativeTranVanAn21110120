package com.universityweb.common;

import com.universityweb.cart.entity.Cart;
import com.universityweb.cart.mapper.CartMapper;
import com.universityweb.cart.repository.CartItemRepos;
import com.universityweb.cart.entity.CartItem;
import com.universityweb.cart.repository.CartRepos;
import com.universityweb.cart.service.CartService;
import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.service.user.UserService;
import com.universityweb.course.model.Course;
import com.universityweb.course.model.Lesson;
import com.universityweb.course.model.Section;
import com.universityweb.course.repository.CourseRepository;
import com.universityweb.course.repository.LessonRepository;
import com.universityweb.course.repository.SectionRepository;
import jakarta.transaction.Transactional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class InitData {
    private final Logger log = LogManager.getLogger(this.getClass().getName());

    private final CartMapper cartMapper = CartMapper.INSTANCE;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepos cartRepos;

    @Autowired
    private CartItemRepos cartItemRepos;

    @Bean
    public void init() {
        List<User> users = initUsers();
        List<Course> savedCourses = initCourses();
//        List<Cart> savedCarts = initCarts(users);
//        List<CartItem> savedCardItems = initCartItems(savedCarts, savedCourses);
    }

    private List<User> initUsers() {
        String commonPass = passwordEncoder.encode("P@123456");

        User student1 = User.builder()
                .username("vanan")
                .password(commonPass)
                .fullName("Van An")
                .email("vanantran05@gmail.com")
                .phoneNumber("+840971640799")
                .bio("Studying at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 12, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User student2 = User.builder()
                .username("hungsam")
                .password(commonPass)
                .fullName("Hung")
                .email("hung@gmail.com")
                .phoneNumber("+840971640788")
                .bio("Studying at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 3, 3))
                .role(User.ERole.STUDENT)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User teacher = User.builder()
                .username("long")
                .password(commonPass)
                .fullName("Hoang Long")
                .email("long@gmail.com")
                .phoneNumber("+840971640710")
                .bio("Teaching at HCMUTE")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2003, 10, 3))
                .role(User.ERole.TEACHER)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        User admin = User.builder()
                .username("admin")
                .password(commonPass)
                .fullName("admin")
                .email("")
                .phoneNumber("")
                .bio("Admin")
                .gender(User.EGender.MALE)
                .dob(LocalDate.of(2024, 7, 3))
                .role(User.ERole.ADMIN)
                .createdAt(LocalDateTime.now())
                .status(User.EStatus.ACTIVE)
                .build();

        List<User> users = List.of(student1, student2, teacher, admin);
        try {
            return userService.saveAll(users);
        } catch (HibernateException e) {
            log.error("Error occurred while saving users", e);
            return users;
        }
    }

    private List<Course> initCourses() {
        List<Course> courses = createCourses();
        Course course1 = courses.get(0);

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        Section section1 = Section.builder()
                .id(1L)
                .title("Introduction to Java")
                .createdBy("admin")
                .createdAt(now.format(formatter))
                .course(course1)
                .build();

        Section section2 = Section.builder()
                .id(2L)
                .title("Advanced Concepts in Java")
                .createdBy("admin")
                .createdAt(now.format(formatter))
                .course(course1)
                .build();

        Lesson lesson1 = Lesson.builder()
                .id(1L)
                .title("Getting Started with Java")
                .type("Video")
                .content("Basic introduction to Java programming.")
                .contentUrl("http://example.com/java-intro.mp4")
                .description("First lesson of the Java Basics course.")
                .duration(60)
                .isPreview(true)
                .startDate(LocalDateTime.now())
                .createdBy("admin")
                .createdAt(LocalDateTime.now())
                .section(section1)
                .build();

        Lesson lesson2 = Lesson.builder()
                .id(2L)
                .title("Java OOP Concepts")
                .type("Video")
                .content("Understanding Object-Oriented Programming in Java.")
                .contentUrl("http://example.com/java-oop.mp4")
                .description("Lesson on OOP concepts in Java.")
                .duration(90)
                .isPreview(false)
                .startDate(LocalDateTime.now())
                .createdBy("admin")
                .createdAt(LocalDateTime.now())
                .section(section2)
                .build();

        try {
            List<Course> savedCourses = courseRepository.saveAll(courses);
            sectionRepository.saveAll(Arrays.asList(section1, section2));
            lessonRepository.saveAll(Arrays.asList(lesson1, lesson2));
            return savedCourses;
        } catch (HibernateException e) {
            log.error("Error occurred while saving courses, sections, and lessons", e);
            return new ArrayList<>();
        }
    }

    private List<Course> createCourses() {
        String commonUrlImg = "https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg";
        String commonAdmin = "admin";
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return Arrays.asList(
                Course.builder()
                        .id(1L)
                        .title("Java Basics")
                        .category("Programming")
                        .level("Beginner")
                        .imageUrl(commonUrlImg)
                        .duration(30)
                        .description("Introduction to Java programming.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(2L)
                        .title("Advanced Python")
                        .category("Programming")
                        .level("Advanced")
                        .imageUrl(commonUrlImg)
                        .duration(40)
                        .description("Deep dive into advanced Python topics.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(3L)
                        .title("Web Development with React")
                        .category("Web Development")
                        .level("Intermediate")
                        .imageUrl(commonUrlImg)
                        .duration(50)
                        .description("Learn web development with React framework.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(4L)
                        .title("Data Science with Python")
                        .category("Data Science")
                        .level("Advanced")
                        .imageUrl(commonUrlImg)
                        .duration(60)
                        .description("Master data science concepts using Python.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(5L)
                        .title("Introduction to Machine Learning")
                        .category("Artificial Intelligence")
                        .level("Beginner")
                        .imageUrl(commonUrlImg)
                        .duration(45)
                        .description("Start your journey into machine learning.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(6L)
                        .title("Full Stack Web Development")
                        .category("Web Development")
                        .level("Advanced")
                        .imageUrl(commonUrlImg)
                        .duration(70)
                        .description("Become a full stack web developer with this course.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(7L)
                        .title("Java Spring Boot Masterclass")
                        .category("Programming")
                        .level("Intermediate")
                        .imageUrl(commonUrlImg)
                        .duration(60)
                        .description("Learn to build web applications with Java Spring Boot.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(8L)
                        .title("Angular for Beginners")
                        .category("Web Development")
                        .level("Beginner")
                        .imageUrl(commonUrlImg)
                        .duration(35)
                        .description("Get started with Angular framework for front-end development.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(9L)
                        .title("Cybersecurity Basics")
                        .category("IT & Software")
                        .level("Beginner")
                        .imageUrl(commonUrlImg)
                        .duration(40)
                        .description("Learn the basics of cybersecurity and protect systems from attacks.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(10L)
                        .title("SQL for Data Analysis")
                        .category("Data Science")
                        .level("Intermediate")
                        .imageUrl(commonUrlImg)
                        .duration(40)
                        .description("Learn SQL for analyzing data in databases.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(11L)
                        .title("DevOps Essentials")
                        .category("IT & Software")
                        .level("Intermediate")
                        .imageUrl(commonUrlImg)
                        .duration(50)
                        .description("Learn the essentials of DevOps and automation.")
                        .isPublish(true)
                        .createdBy("admin")
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(12L)
                        .title("Cloud Computing with AWS")
                        .category("Cloud Computing")
                        .level("Advanced")
                        .imageUrl(commonUrlImg)
                        .duration(55)
                        .description("Master AWS services and cloud architecture.")
                        .isPublish(true)
                        .createdBy(commonAdmin)
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(13L)
                        .title("React Native: Mobile Development")
                        .category("Mobile Development")
                        .level("Intermediate")
                        .imageUrl(commonUrlImg)
                        .duration(45)
                        .description("Develop cross-platform mobile apps with React Native.")
                        .isPublish(true)
                        .createdBy("admin")
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(14L)
                        .title("UI/UX Design Fundamentals")
                        .category("Design")
                        .level("Beginner")
                        .imageUrl(commonUrlImg)
                        .duration(35)
                        .description("Learn the fundamentals of UI/UX design.")
                        .isPublish(true)
                        .createdBy("admin")
                        .createdAt(LocalDateTime.now())
                        .build(),
                Course.builder()
                        .id(15L)
                        .title("Blockchain Development")
                        .category("Programming")
                        .level("Advanced")
                        .imageUrl(commonUrlImg)
                        .duration(65)
                        .description("Develop decentralized applications with blockchain.")
                        .isPublish(true)
                        .createdBy("admin")
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    private List<Cart> initCarts(List<User> users) {
        List<Cart> savedCarts = new ArrayList<>();
        try {
            Long index = 0L;
            for (User user : users) {
                Cart cart = Cart.builder()
                        .id(index)
                        .updatedAt(LocalDateTime.now())
                        .user(user)
                        .build();

                Cart saved = cartRepos.save(cart);
                savedCarts.add(saved);
                index++;
            }
        } catch (RuntimeException e) {
            log.error(e);
            savedCarts = cartRepos.findAll();
        }
        return savedCarts;
    }

    private List<CartItem> initCartItems(List<Cart> savedCarts, List<Course> savedCourses) {
        Cart cart = savedCarts.get(0);
        Course course = savedCourses.get(0);
        Course course1 = savedCourses.get(1);

        CartItem cartItem = CartItem.builder()
                .id(1L)
                .status(CartItem.EStatus.ACTIVE)
                .discountPercent(BigDecimal.ZERO)
                .updatedAt(LocalDateTime.now())
                .course(course)
                .cart(cart)
                .build();

        CartItem cartItem1 = CartItem.builder()
                .id(2L)
                .status(CartItem.EStatus.ACTIVE)
                .discountPercent(BigDecimal.ZERO)
                .updatedAt(LocalDateTime.now())
                .course(course1)
                .cart(cart)
                .build();

        try {
            return cartItemRepos.saveAll(Arrays.asList(cartItem, cartItem1));
        } catch (HibernateException e) {
            log.error("Error occurred while saving cart items", e);
            return new ArrayList<>();
        }
    }
}

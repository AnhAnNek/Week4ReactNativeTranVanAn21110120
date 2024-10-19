import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Sử dụng FontAwesome cho icon ngôi sao

// Dữ liệu giả lập của các khóa học
const courses = [
  {
    id: '1',
    title: 'The Complete Python Bootcamp From Zero to Hero in Python',
    instructor: 'Jose Portilla, Pierian Training',
    rating: 4.6,
    reviews: 519983,
    price: '1.499.000 ₫',
    image: 'https://img-c.udemycdn.com/course/240x135/567828_67d0.jpg',
    bestseller: false,
  },
  {
    id: '2',
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    instructor: 'Dr. Angela Yu, Developer and Lead Instructor',
    rating: 4.7,
    reviews: 328913,
    price: '2.299.000 ₫',
    image: 'https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg',
    bestseller: true,
  },
];

// Component để hiển thị ngôi sao đánh giá
const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  // Lặp qua để tạo icon ngôi sao
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Icon key={`full-${i}`} name="star" size={16} color="#f5a623" />);
  }
  if (halfStar) {
    stars.push(<Icon key="half" name="star-half" size={16} color="#f5a623" />);
  }
  while (stars.length < 5) {
    stars.push(<Icon key={`empty-${stars.length}`} name="star-o" size={16} color="#f5a623" />);
  }

  return <View style={styles.ratingContainer}>{stars}</View>;
};

// Component để render mỗi khóa học
const CourseItem = ({ course }) => {
  return (
    <View style={styles.courseContainer}>
      <Image source={{ uri: course.image }} style={styles.courseImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.instructor}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.courseRating}>{course.rating}</Text>
          <Rating rating={course.rating} />
          <Text style={styles.courseReviews}>({course.reviews})</Text>
        </View>
        <Text style={styles.coursePrice}>{course.price}</Text>
        {course.bestseller && (
          <TouchableOpacity style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>Bestseller</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Component chính
const Wishlist = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseItem course={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  courseContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  courseRating: {
    fontSize: 14,
    color: '#f5a623',
    marginRight: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  courseReviews: {
    fontSize: 12,
    color: '#666',
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  bestsellerBadge: {
    backgroundColor: '#f5f5a3',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  bestsellerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Wishlist;
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

const courses = [
  {
    id: '1',
    image: 'https://img-b.udemycdn.com/course/240x135/567828_67d0.jpg', // Example image URL
    title: 'The Complete Python Bootcamp From Zero to Hero in Python',
    instructor: 'Jose Portilla, Pierian Training',
    rating: 4.6,
    ratingCount: 519691,
    price: '249.000 ₫',
    originalPrice: '1.499.000 ₫',
    isBestseller: false,
  },
  {
    id: '2',
    image: 'https://img-b.udemycdn.com/course/240x135/2776760_f176_5.jpg', // Example image URL
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    instructor: 'Dr. Angela Yu, Developer and Lead Instructor',
    rating: 4.7,
    ratingCount: 328276,
    price: '349.000 ₫',
    originalPrice: '2.299.000 ₫',
    isBestseller: true,
  },
];

const CourseItem = ({ course }) => {
  return (
    <View style={styles.courseContainer}>
      <Image source={{ uri: course.image }} style={styles.courseImage} />
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.instructor}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.courseRating}>{course.rating}</Text>
          <Text style={styles.ratingStars}>★ ★ ★ ★ ★</Text>
          <Text style={styles.ratingCount}>({course.ratingCount})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.coursePrice}>{course.price}</Text>
          <Text style={styles.originalPrice}>{course.originalPrice}</Text>
        </View>
        {course.isBestseller && (
          <View style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>Bestseller</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const CourseListScreen = () => {
  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CourseItem course={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  courseContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  courseDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseInstructor: {
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseRating: {
    color: '#f4b400',
    fontWeight: 'bold',
    marginRight: 4,
  },
  ratingStars: {
    color: '#f4b400',
  },
  ratingCount: {
    marginLeft: 4,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coursePrice: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  bestsellerBadge: {
    backgroundColor: '#f4b400',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  bestsellerText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CourseListScreen;
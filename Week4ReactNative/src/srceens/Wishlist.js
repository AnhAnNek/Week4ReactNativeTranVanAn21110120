import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For FontAwesome icons
import courseService from '../services/courseService'; // Import the API service

// Component to display the star rating
const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

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

// Component to render each course
const CourseItem = ({ course }) => {
  return (
    <View style={styles.courseContainer}>
      <Image source={{ uri: course.imagePreview }} style={styles.courseImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseInstructor}>{course.teacher}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.courseRating}>{course.rating}</Text>
          <Rating rating={course.rating} />
          <Text style={styles.courseReviews}>({course.ratingCount})</Text>
        </View>
        <Text style={styles.coursePrice}>{`${course.realPrice} ₫`}</Text>
        {course.isBestseller && (
          <TouchableOpacity style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>Bestseller</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Main Wishlist component
const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      const courseRequest = { createdBy: 'hungsam' }; // Example request data
      const fetchedCourses = await courseService.getAllCourseFavouriteOfStudent(courseRequest);
      setCourses(fetchedCourses || []); // Fallback to an empty array if no data
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={({ item }) => <CourseItem course={item} />}
        keyExtractor={(item) => item.id.toString()}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Wishlist;
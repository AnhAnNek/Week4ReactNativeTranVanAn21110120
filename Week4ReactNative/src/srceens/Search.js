import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import courseService from '../services/courseService';
import IconR from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Rating = ({rating}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Icon key={`full-${i}`} name="star" size={16} color="#f5a623" />,
    );
  }
  if (halfStar) {
    stars.push(<Icon key="half" name="star-half" size={16} color="#f5a623" />);
  }
  while (stars.length < 5) {
    stars.push(
      <Icon
        key={`empty-${stars.length}`}
        name="star-o"
        size={16}
        color="#f5a623"
      />,
    );
  }

  return <View style={styles.ratingContainer}>{stars}</View>;
};

const CourseItem = ({course, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.courseContainer}>
        <Image
          source={{uri: course?.imagePreview}}
          style={styles.courseImage}
        />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course?.title}</Text>
          <Text style={styles.courseInstructor}>{course?.ownerUsername}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.courseRating}>{course?.rating.toFixed(1)}</Text>
            <Rating rating={course?.rating} />
            <Text style={styles.courseReviews}>({course?.ratingCount})</Text>
          </View>
          <Text style={styles.coursePrice}>{`${course?.price?.price} ₫`}</Text>
          {course.isBestseller && (
            <TouchableOpacity style={styles.bestsellerBadge}>
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Course = () => {
  const [courses, setCourses] = useState([]); // All loaded courses
  const [loading, setLoading] = useState(true); // Initial loading indicator
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [pageNumber, setPageNumber] = useState(0); // Current page for lazy loading
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Prevent duplicate fetches
  const navigation = useNavigation();

  // Function to fetch courses
  const fetchCourses = async (page = 0, reset = false) => {
    try {
      const courseRequest = {
        pageNumber: page, // Current page
        size: 5, // Fetch 5 courses per request
        title: searchQuery || null,
      };

      const fetchedCourses = await courseService.getCourse(courseRequest);

      if (reset) {
        // Reset course list on new search
        setCourses(fetchedCourses || []);
      } else {
        // Append new courses for lazy loading
        setCourses(prevCourses => [...prevCourses, ...(fetchedCourses || [])]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false); // Stop initial loader
      setIsFetchingMore(false); // Allow further lazy loading
    }
  };

  // Fetch courses on initial render or when search query changes
  useEffect(() => {
    setLoading(true); // Show loader
    setPageNumber(0); // Reset page number for new search
    fetchCourses(0, true); // Fetch the first page and reset the list
  }, [searchQuery]);

  // Handle lazy loading when reaching the end of the list
  const loadMoreCourses = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true); // Prevent duplicate requests
      const nextPage = pageNumber + 1; // Increment page number
      setPageNumber(nextPage); // Update state
      fetchCourses(nextPage); // Fetch the next page
    }
  };

  // Navigate to course detail screen and save course to history
  const goToCourseDetail = course => {
    saveCourseToHistory(course); // Save to history
    navigation.navigate('Course Detail', {course}); // Navigate
  };

  // Save course to AsyncStorage history
  const saveCourseToHistory = async course => {
    try {
      const history = await AsyncStorage.getItem('courseHistory');
      const historyArray = history ? JSON.parse(history) : [];

      // Check if course is already in history
      const isAlreadySaved = historyArray.some(item => item.id === course.id);
      if (!isAlreadySaved) {
        historyArray.push(course);
        await AsyncStorage.setItem(
          'courseHistory',
          JSON.stringify(historyArray),
        );
      }
    } catch (error) {
      console.error('Error saving course to history:', error);
    }
  };

  // Show loader while fetching initial courses
  if (loading && pageNumber === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render component
  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <IconR name="search-outline" size={20} color="#000" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search courses..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity>
          <IconR name="filter-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Course list */}
      <FlatList
        style={styles.scrollView}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}
        data={courses}
        renderItem={({item}) => (
          <CourseItem course={item} onPress={() => goToCourseDetail(item)} />
        )}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMoreCourses} // Trigger lazy loading
        onEndReachedThreshold={0.5} // Load more when 50% from the end
        ListFooterComponent={
          isFetchingMore && <ActivityIndicator size="small" color="#0000ff" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
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

export default Course;

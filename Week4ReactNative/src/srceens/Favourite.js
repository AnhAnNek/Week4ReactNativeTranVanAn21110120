import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import favoriteService from '../services/favouriteService';
import {useNavigation} from '@react-navigation/native';
import {errorToast, successToast} from '../utils/methods';

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

const CourseItem = ({course, onDelete}) => {
  const navigation = useNavigation();

  const handleCoursePress = () => {
    navigation.navigate('CourseDetail', {course});
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this item from your favourite?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Ok',
          onPress: () => onDelete(course?.id),
        },
      ],
    );
  };

  return (
    <TouchableOpacity onPress={handleCoursePress}>
      <View style={styles.courseContainer}>
        <Image
          source={{uri: course?.imagePreview}}
          style={styles.courseImage}
        />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course?.title}</Text>
          <Text style={styles.courseInstructor}>{course?.ownerUsername}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.courseRating}>{course?.rating}</Text>
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
        {/* Delete Button */}
        <TouchableOpacity onPress={handleDeletePress}>
          <Icon name="trash" size={20} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const Favourite = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const fetchedCourses = await favoriteService.getAllFavorites(0, 8);
      setCourses(fetchedCourses.content || []);
      setFilteredCourses(fetchedCourses.content || []); // Initialize filtered courses
    } catch (error) {
      errorToast('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCourses(); // Fetch notifications again
    setRefreshing(false);
  };

  const handleDeleteCourse = async courseId => {
    try {
      setLoading(true);
      const result = await favoriteService.deleteFavourite(courseId);
      if (result !== null) {
        setCourses(prevCourses =>
          prevCourses.filter(course => course.id !== courseId),
        );
        setFilteredCourses(prevCourses =>
          prevCourses.filter(course => course.id !== courseId),
        );
        successToast('Course removed from wishlist.');
      } else {
        errorToast('Failed to remove course from wishlist.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      errorToast('An error occurred while removing the course.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCourses(filtered);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search courses..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView
        style={styles.scrollContainer}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {filteredCourses.map(course => (
          <CourseItem
            key={course.id.toString()}
            course={course}
            onDelete={handleDeleteCourse}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default Favourite;

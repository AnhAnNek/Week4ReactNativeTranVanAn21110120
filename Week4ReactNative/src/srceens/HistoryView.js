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
import {ScrollView} from 'react-native-gesture-handler';
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
      </View>
    </TouchableOpacity>
  );
};

const HistoryViewCourse = () => {
  const [historyCourses, setHistoryCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Lấy danh sách khóa học từ AsyncStorage
  const fetchHistoryCourses = async () => {
    try {
      const history = await AsyncStorage.getItem('courseHistory');
      const historyArray = history ? JSON.parse(history) : [];
      setHistoryCourses(historyArray);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học từ lịch sử:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryCourses();
  }, []);

  const goToCourseDetail = course => {
    navigation.navigate('CourseDetail', {course});
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{right: 1}}>
      {historyCourses.map(course => (
        <CourseItem
          key={course.id}
          course={course}
          onPress={() => goToCourseDetail(course)}
        />
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

export default HistoryViewCourse;

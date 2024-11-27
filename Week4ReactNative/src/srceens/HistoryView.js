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
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  const [refreshing, setRefreshing] = useState(false);

  // Fetch the viewed courses from AsyncStorage
  const fetchHistoryCourses = async () => {
    try {
      const history = await AsyncStorage.getItem('courseHistory');
      const historyArray = history ? JSON.parse(history) : [];
      setHistoryCourses(historyArray);
    } catch (error) {
      console.error('Error fetching course history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistoryCourses(); // Fetch notifications again
    setRefreshing(false);
  };

  // Clear the course history
  const clearHistory = async () => {
    try {
      // Show a confirmation dialog
      Alert.alert(
        'Clear History',
        'Are you sure you want to delete the entire course history?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'OK',
            onPress: async () => {
              await AsyncStorage.removeItem('courseHistory');
              setHistoryCourses([]); // Update state to clear the UI
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error clearing course history:', error);
    }
  };

  // Navigate to the course details screen
  const goToCourseDetail = course => {
    navigation.navigate('CourseDetail', {course});
  };

  useEffect(() => {
    fetchHistoryCourses();
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
      {/* Clear History Button */}

      <ScrollView
        style={styles.scrollContainer}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {historyCourses.length > 0 ? (
          historyCourses.map(course => (
            <CourseItem
              key={course.id}
              course={course}
              onPress={() => goToCourseDetail(course)}
            />
          ))
        ) : (
          <Text style={styles.noHistoryText}>No viewed courses found.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
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
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  noHistoryText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default HistoryViewCourse;

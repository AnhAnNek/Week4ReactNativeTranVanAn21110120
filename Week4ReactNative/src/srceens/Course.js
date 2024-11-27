import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import courseService from '../services/courseService';

const DEFAULT_SIZE = 8;

const CourseScreen = ({navigation}) => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadFilteredCourses = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const newCourses = await courseService.getCourseByTopic({topicId: 1});
      setHasMore(newCourses.length >= DEFAULT_SIZE);
      setCourses(newCourses);
      setPageNumber(pageNumber);
    } catch (error) {
      console.error('Error fetching filtered courses:', error.message);
      ToastAndroid.show('Không thể tải danh sách khóa học', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const initCourses = async () => {
    setLoading(true);
    try {
      const newCourses = await courseService.getCourse({type: 'new'});
      setHasMore(newCourses.length >= DEFAULT_SIZE);
      setCourses(newCourses);
      setPageNumber(1);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      ToastAndroid.show('Không thể tải danh sách khóa học', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initCourses();
  }, []);

  const goToCourseDetail = course => {
    navigation.navigate('Course Detail', {course});
  };

  const loadMoreCourses = async () => {
    if (loading || !hasMore) {
      const message = loading
        ? 'Loading is already in progress. Please wait...'
        : 'No more courses to load!';
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        // alert(message);
      }
      return;
    }

    setLoading(true);
    try {
      const page = pageNumber + 1;
      let newCourses = [];

      if (!searchQuery && price === '') {
        newCourses = await courseService.fetchCourses(page);
      } else {
        newCourses = await courseService.fetchFilteredCourses(
          searchQuery,
          price,
          page,
        );
      }

      setHasMore(newCourses.length >= DEFAULT_SIZE);
      setCourses(prevCourses => [
        ...prevCourses,
        ...newCourses.filter(
          newCourse =>
            !prevCourses.some(prevCourse => prevCourse.id === newCourse.id),
        ),
      ]);
      setPageNumber(page);
    } catch (error) {
      console.error('Error loading more courses:', error.message);
      ToastAndroid.show('Không thể tải thêm khóa học', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const refreshCourse = () => {
    setSearchQuery('');
    setPrice('');
    setPageNumber(1);
    initCourses();
  };

  const filterCourses = () => {
    setPageNumber(1);
    loadFilteredCourses(1);
  };

  const renderCourseItem = ({item}) => (
    <TouchableOpacity onPress={() => goToCourseDetail(item)}>
      <View style={styles.courseItem}>
        <Image source={{uri: item.imagePreview}} style={styles.courseImage} />
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseInstructor}>{item.createdBy}</Text>
          <Text style={styles.coursePrice}>{item.price} đ</Text>
          <Text style={styles.courseDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search-outline" size={20} color="#fff" />
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm khóa học..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={filterCourses}>
          <Icon name="filter-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Giá từ:</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Nhập giá..."
          placeholderTextColor="#ccc"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.courseList}
        onEndReached={loadMoreCourses}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? <ActivityIndicator size="small" color="#000" /> : null
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshCourse} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    color: '#000',
  },
  courseList: {
    paddingBottom: 16,
  },
  courseItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  courseDetails: {
    flex: 1,
    marginLeft: 10,
  },
  courseTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseInstructor: {
    color: '#000',
    fontSize: 14,
    marginTop: 4,
  },
  coursePrice: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  courseDescription: {
    color: '#000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CourseScreen;

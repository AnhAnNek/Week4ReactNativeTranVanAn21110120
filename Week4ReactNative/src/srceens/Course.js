import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { get } from '../utils/httpRequest'
import {BASE_URL} from "../utils/constants";

const CourseScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = async (pageNumber = 1) => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const response = await get(`${BASE_URL}/courses`, {
        params: {
          price: price !== '' ? parseInt(price, 10) : 0,
          name: searchQuery,
          pageNumber: pageNumber,
          size: 8
        },
      });

      const newCourses = response.data;

      setCourses((prevCourses) => [...prevCourses, ...newCourses]);
      setHasMore(newCourses.length === 10);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  // Gọi API để lọc các khóa học theo giá và tên
  const filterCourses = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await get(`${BASE_URL}/courses/filter`, {
        params: {
          price: price !== '' ? parseInt(price, 10) : 0, // Dynamic price from input
          name: searchQuery, // Truyền tên khóa học từ input tìm kiếm
          pageNumber: pageNumber,
          size: 10
        },
      });

      setCourses(response.data); // Cập nhật danh sách khóa học sau khi lọc
      setLoading(false);
    } catch (error) {
      console.error('Error filtering courses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(pageNumber);
  }, [pageNumber]);

  const goToCourseDetail = (course) => {
    navigation.navigate('CourseDetail', { course });
  };

  const loadMoreCourses = () => {
    console.log(`loadMoreCourses() method`)
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const refreshList = () => {
    setLoading(true);
    setPageNumber(1);
    fetchCourses(1);
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToCourseDetail(item)}>
      <View style={styles.courseItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.courseImage} />
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
      {/* Thanh tìm kiếm */}
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

      {/* Input for price filtering */}
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

      {/* Hiển thị loading */}
      {loading ? <ActivityIndicator size="large" color="#000" /> : null}

      {/* Hiển thị danh sách khóa học */}
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.courseList}
        onEndReached={loadMoreCourses} // Load more when the user reaches the end
        onEndReachedThreshold={0.5} // Trigger loadMoreCourses when 50% of the list is visible
        ListFooterComponent={hasMore && <ActivityIndicator size="small" color="#000" />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
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

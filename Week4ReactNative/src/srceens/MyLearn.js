import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import enrollmentService from '../services/enrollmentService';

const MyLearn = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentCourses = async () => {
    setLoading(true);
    try {
      console.log('Fetching student courses...');
      const studentCourses = await enrollmentService.getAllEnrolls(0, 100);
      if (studentCourses) {
        setCourses(studentCourses.content);
      }
    } catch (error) {
      console.error('Error fetching student courses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudentCourses(); // Fetch notifications again
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStudentCourses();
  }, []);

  const renderCourseItem = ({item}) => {
    // Determine button text based on progress
    let buttonText;
    if (item.progress === 0) {
      buttonText = 'Start Learning';
    } else if (item.progress === 100) {
      buttonText = 'Complete';
    } else {
      buttonText = 'Continue';
    }

    return (
      <View style={styles.courseContainer}>
        <Image source={{uri: item.imagePreview}} style={styles.courseImage} />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseAuthor}>{item.teacher}</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${item.progress || 0}%`}]}
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress || 0}% complete
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Play Course', {courseId: item.id})
            }>
            <Text style={styles.startCourse}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  courseContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  startCourse: {
    color: '#5E3BE1',
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5E3BE1',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default MyLearn;

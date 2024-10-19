import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Để render icon tìm kiếm và lọc
import { useNavigation } from '@react-navigation/native';
// Dữ liệu giả lập của các khóa học
const courses = [
    {
        id: '1',
        title: 'IELTS Booster and Beyond: Enhance speaking pt 1from 6 to 7',
        author: 'Nathaniel Jensen',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-4.jpg',
        progress: null,
    },
    {
        id: '2',
        title: 'IELTS daily bites (free course)',
        author: 'Sian Lovegrove',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-5.jpg',
        progress: null,
    },
    {
        id: '3',
        title: 'IELTS Booster and Beyond Premium Course 2-Note-taking skills',
        author: 'Nathaniel Jensen',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-3.jpg',
        progress: '3%',
    },
    {
        id: '4',
        title: 'IELTS Speaking',
        author: 'Sapna Mittu',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003824/samples/cup-on-a-table.jpg',
        progress: null,
    },
    {
        id: '5',
        title: 'IELTS Speaking Secrets: Master the Live Interview',
        author: 'Brian Gabriel',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003823/samples/man-portrait.jpg',
        progress: null,
    },
    {
        id: '6',
        title: 'Brainstorm Like a Pro - Top Ideas for IELTS Writing Task 2',
        author: 'Pooya Abedi',
        image: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample.jpg',
        progress: null,
    },
];

// Component để render mỗi khóa học
const CourseItem = ({ course }) => {
  const navigation = useNavigation(); // Lấy đối tượng điều hướng

  return (
      <View style={styles.courseContainer}>
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseAuthor}>{course.author}</Text>
              {course.progress ? (
                  <>
                      <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: course.progress }]} />
                      </View>
                      <Text style={styles.progressText}>{course.progress} complete</Text>
                  </>
              ) : (
                  <TouchableOpacity onPress={() => navigation.navigate('PlayCourse')}>
                      <Text style={styles.startCourse}>Start course</Text>
                  </TouchableOpacity>
              )}
          </View>
      </View>
  );
};

// Component chính
const MyLearn = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>My learning</Text>
                <View style={styles.headerIcons}>
                    <Icon name="search" size={24} color="black" style={styles.icon} />
                    <Icon name="filter-list" size={24} color="black" style={styles.icon} />
                </View>
            </View> */}

            {/* Danh sách khóa học */}
            <FlatList
                data={courses}
                renderItem={({ item }) => <CourseItem course={item} />}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

// StyleSheet cho component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 16,
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
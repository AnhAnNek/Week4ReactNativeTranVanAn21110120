import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import {Video} from 'expo-av';
import sectionService from '../services/sectionService';
import lessonService from '../services/lessonService';
import lessonTrackerService from '../services/lessonTrackerService'; // Import the service for completing lessons
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayCourse = ({route}) => {
  const {courseId, username} = route.params; // Assuming username is passed via route params
  const [sections, setSections] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSectionsAndLessons = async () => {
    try {
      setLoading(true);

      // Gọi API lấy danh sách các section
      const sectionRequest = {courseId};
      const fetchedSections = await sectionService.getAllSectionByCourse(
        sectionRequest,
      );

      // Gọi API lấy bài học đầu tiên chưa hoàn thành
      const firstUnlearnedLesson =
        await lessonTrackerService.getFirstUnlearnedLesson(courseId);

      if (fetchedSections) {
        const sectionsWithLessons = await Promise.all(
          fetchedSections.map(async section => {
            const lessonRequest = {sectionId: section.id};
            const fetchedLessons = await lessonService.getAllLessonBySection(
              lessonRequest,
            );
            return {
              ...section,
              lessons: fetchedLessons || [],
            };
          }),
        );

        setSections(sectionsWithLessons);

        // Nếu API trả về lessonId, tìm bài học tương ứng
        if (firstUnlearnedLesson?.id) {
          const foundLesson = sectionsWithLessons
            .flatMap(section => section.lessons)
            .find(lesson => lesson.id === firstUnlearnedLesson.id);

          if (foundLesson) {
            setSelectedLesson(foundLesson);
          } else if (
            sectionsWithLessons.length > 0 &&
            sectionsWithLessons[0].lessons.length > 0
          ) {
            // Nếu không tìm thấy, lấy bài học đầu tiên
            setSelectedLesson(sectionsWithLessons[0].lessons[0]);
          }
        } else if (
          sectionsWithLessons.length > 0 &&
          sectionsWithLessons[0].lessons.length > 0
        ) {
          setSelectedLesson(sectionsWithLessons[0].lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching sections and lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeAndNextLesson = async () => {
    if (!selectedLesson) return;

    if (!selectedLesson.completed) {
      try {
        await lessonTrackerService.createCompleteLesson({
          lessonId: selectedLesson.id,
          username,
          isCompleted: true,
        });

        setSections(prevSections =>
          prevSections.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson =>
              lesson.id === selectedLesson.id
                ? {...lesson, completed: true}
                : lesson,
            ),
          })),
        );
      } catch (error) {
        console.error('Error completing lesson:', error);
        return;
      }
    }

    const allLessons = sections.flatMap(section => section.lessons);
    const currentIndex = allLessons.findIndex(
      lesson => lesson.id === selectedLesson.id,
    );

    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1]);
    } else {
      alert('You have completed all lessons in this course!');
    }
  };

  useEffect(() => {
    fetchSectionsAndLessons();
  }, [courseId]);

  const LessonItem = ({lesson, onPress}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.lessonContainer}>
        <View style={styles.lessonTextContainer}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDuration}>
            Video - {lesson.duration} mins
          </Text>
        </View>
        {lesson.completed && (
          <Icon name="check" size={20} color="green" style={styles.checkmark} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedLesson && (
        <View style={styles.fixedVideoContainer}>
          <Video
            source={{uri: selectedLesson.contentUrl}}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <Text style={styles.currentLessonTitle}>{selectedLesson.title}</Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={completeAndNextLesson}>
            <Text style={styles.nextButtonText}>
              {selectedLesson.completed ? 'Next' : 'Complete & Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.lessonList}>
        {sections.map(section => (
          <View key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <FlatList
              data={section.lessons}
              renderItem={({item}) => (
                <LessonItem
                  lesson={item}
                  onPress={() => setSelectedLesson(item)}
                />
              )}
              keyExtractor={item => item.id.toString()}
            />
          </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedVideoContainer: {
    marginTop: 15,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: Dimensions.get('window').width * 0.56,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  video: {
    marginTop: 20,
    width: '100%',
    height: '100%',
  },
  currentLessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  nextButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lessonList: {
    marginTop: Dimensions.get('window').width * 0.56 + 60,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f1f1f1',
    color: '#666',
  },
  lessonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    alignSelf: 'center',
  },
});

export default PlayCourse;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Video} from 'expo-av';
import authService from '../services/authService';
import sectionService from '../services/sectionService';
import lessonService from '../services/lessonService';
import lessonTrackerService from '../services/lessonTrackerService';
import Icon from 'react-native-vector-icons/FontAwesome';
import {successToast} from '../utils/methods';

const PlayCourse = ({route}) => {
  const {courseId} = route.params;
  const [sections, setSections] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Ref for ScrollView to scroll to the selected lesson
  const scrollViewRef = useRef(null);

  const fetchSectionsAndLessons = async () => {
    try {
      setLoading(true);

      const sectionRequest = {courseId};
      const fetchedSections = await sectionService.getAllSectionByCourse(
        sectionRequest,
      );

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

    const username = user?.username;
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
        successToast('Lesson completed successfully!');
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

  const fetchUserByToken = async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurUser();
      setUser(userData);
    } catch (error) {
      errorToast('An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsAndLessons();
    fetchUserByToken();
  }, [courseId]);

  useEffect(() => {
    if (selectedLesson && scrollViewRef.current) {
      // Scroll to the selected lesson when it's updated
      const selectedLessonIndex = sections
        .flatMap(section => section.lessons)
        .findIndex(lesson => lesson.id === selectedLesson.id);

      if (selectedLessonIndex >= 0 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: selectedLessonIndex * 90, // Adjust the scroll position (60 is an approximation of row height)
          animated: true,
        });
      }
    }
  }, [selectedLesson, sections]);

  const LessonItem = ({lesson, onPress, isSelected}) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.lessonContainer,
          isSelected && styles.selectedLessonContainer, // Highlight selected lesson
        ]}>
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

      <ScrollView
        ref={scrollViewRef}
        style={styles.lessonList}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}>
        {sections.map(section => (
          <View key={section.id}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <FlatList
              data={section.lessons}
              renderItem={({item}) => (
                <LessonItem
                  lesson={item}
                  onPress={() => setSelectedLesson(item)}
                  isSelected={selectedLesson?.id === item.id}
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
  selectedLessonContainer: {
    backgroundColor: '#e9d8fe', // Background color for selected lesson
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
    backgroundColor: '#a855f7',
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

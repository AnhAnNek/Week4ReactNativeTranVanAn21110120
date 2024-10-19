import React, { useState, useEffect } from 'react';
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
import { Video } from 'expo-av';
import sectionService from '../services/sectionService'; // Import section service
import lessonService from '../services/lessonService'; // Import lesson service

const PlayCourse = ({ route }) => {
    const { courseId } = route.params; // Assume courseId is passed as a prop
    const [sections, setSections] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch sections and lessons based on the courseId
    const fetchSectionsAndLessons = async () => {
        try {
            setLoading(true);

            // Fetch sections of the course
            const sectionRequest = { courseId };
            const fetchedSections = await sectionService.getAllSectionByCourse(sectionRequest);

            if (fetchedSections) {
                const sectionsWithLessons = await Promise.all(
                    fetchedSections.map(async (section) => {
                        // Fetch lessons for each section
                        const lessonRequest = { sectionId: section.id };
                        const fetchedLessons = await lessonService.getAllLessonBySection(lessonRequest);
                        return {
                            ...section,
                            lessons: fetchedLessons || [], // Attach lessons to the section
                        };
                    })
                );

                setSections(sectionsWithLessons);

                // Set the first lesson as the default selected lesson
                if (sectionsWithLessons.length > 0 && sectionsWithLessons[0].lessons.length > 0) {
                    setSelectedLesson(sectionsWithLessons[0].lessons[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching sections and lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSectionsAndLessons();
    }, [courseId]);

    const LessonItem = ({ lesson, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.lessonContainer}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>Video - {lesson.duration} mins</Text>
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
            {/* Video of the selected lesson */}
            {selectedLesson && (
                <View style={styles.fixedVideoContainer}>
                    <Video
                        source={{ uri: selectedLesson.contentUrl }}
                        style={styles.video}
                        useNativeControls
                        resizeMode="contain"
                        isLooping
                    />
                    <Text style={styles.currentLessonTitle}>{selectedLesson.title}</Text>
                </View>
            )}

            {/* List of sections and lessons */}
            <ScrollView style={styles.lessonList}>
                {sections.map((section) => (
                    <View key={section.id}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <FlatList
                            data={section.lessons}
                            renderItem={({ item }) => (
                                <LessonItem lesson={item} onPress={() => setSelectedLesson(item)} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
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
    lessonList: {
        marginTop: Dimensions.get('window').width * 0.56 + 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: 16,
        backgroundColor: '#f1f1f1',
        color: '#666',
    },
    lessonContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
});

export default PlayCourse;
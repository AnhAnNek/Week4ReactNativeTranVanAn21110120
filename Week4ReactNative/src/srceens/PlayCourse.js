import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Video } from 'expo-av';  // Sử dụng Video từ expo-av

// Dữ liệu giả lập cho các bài giảng theo section
const sections = [
    {
        id: '1',
        sectionTitle: 'Section 1 - Introduction to IELTS',
        lessons: [
            { id: '1', title: 'Why Join this Course?', duration: '01:30 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '2', title: 'Introduction to IELTS', duration: '03:40 mins remaining', videoUrl: 'https://res.cloudinary.com/dnvfrgxjt/video/upload/v1729304123/jpkpvcnbivvqdxetfo5w.mp4' },
            { id: '3', title: 'IELTS Test Format Overview', duration: '02:20 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: '2',
        sectionTitle: 'Section 2 - Listening Module',
        lessons: [
            { id: '4', title: 'Listening Test Overview', duration: '02:45 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '5', title: 'Question Types in Listening', duration: '03:12 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '6', title: 'Tips for Improving Listening Skills', duration: '02:30 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '7', title: 'Practice Listening Test', duration: '04:10 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
    {
        id: '3',
        sectionTitle: 'Section 3 - Reading Module',
        lessons: [
            { id: '8', title: 'Reading Test Overview', duration: '02:35 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '9', title: 'Question Types in Reading', duration: '03:05 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: '10', title: 'Reading Strategies and Tips', duration: '02:50 mins remaining', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        ],
    },
];

// Component để hiển thị từng bài giảng
const LessonItem = ({ lesson, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.lessonContainer}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonDuration}>Video - {lesson.duration}</Text>
        </View>
    </TouchableOpacity>
);

// Component chính
const PlayCourse = () => {
    const [selectedLesson, setSelectedLesson] = useState(sections[0].lessons[0]);

    return (
        <View style={styles.container}>
            {/* Video của bài học hiện tại */}
            <View style={styles.fixedVideoContainer}>
                <Video
                    source={{ uri: selectedLesson.videoUrl }}
                    style={styles.video}
                    useNativeControls  // Hiển thị các điều khiển video
                    resizeMode="contain"
                    isLooping
                />
                <Text style={styles.currentLessonTitle}>{selectedLesson.title}</Text>
            </View>

            {/* Danh sách bài giảng */}
            <ScrollView style={styles.lessonList}>
                {sections.map((section) => (
                    <View key={section.id}>
                        <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
                        <FlatList
                            data={section.lessons}
                            renderItem={({ item }) => (
                                <LessonItem
                                    lesson={item}
                                    onPress={() => setSelectedLesson(item)}
                                />
                            )}
                            keyExtractor={(item) => item.id}
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
    fixedVideoContainer: {
        marginTop: 15,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: Dimensions.get('window').width * 0.56,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Đảm bảo video ở trên các thành phần khác
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
        marginTop: Dimensions.get('window').width * 0.56 + 40, // Đảm bảo danh sách không bị video đè lên
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
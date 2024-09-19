import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CourseDetail = ({ route }) => {
    const { course } = route.params;
    const [expandedSections, setExpandedSections] = useState([]); // State to track expanded sections

    // Toggle section visibility
    const toggleSection = (sectionId) => {
        setExpandedSections((prevExpandedSections) =>
            prevExpandedSections.includes(sectionId)
                ? prevExpandedSections.filter(id => id !== sectionId)
                : [...prevExpandedSections, sectionId]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Course Image */}
            <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />

            {/* Course Information */}
            <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>Người tạo: {course.createdBy}</Text>
                <Text style={styles.coursePrice}>{course.price} đ</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
            </View>

            {/* Sections and Lessons */}
            {course.sections.map((section, sectionIndex) => (
                <View key={section.id} style={styles.sectionContainer}>
                    <TouchableOpacity onPress={() => toggleSection(section.id)} style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Phần {sectionIndex + 1} - {section.title}
                        </Text>
                        <Icon
                            name={expandedSections.includes(section.id) ? 'remove-circle-outline' : 'add-circle-outline'}
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>

                    {/* Conditionally render lessons if the section is expanded */}
                    {expandedSections.includes(section.id) && (
                        <View style={styles.lessonList}>
                            {section.lessons.map((lesson, lessonIndex) => (
                                <View key={lesson.id} style={styles.lessonItem}>
                                    <Text style={styles.lessonIndex}>{lessonIndex + 1}</Text>
                                    <View style={styles.lessonDetails}>
                                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                        <Text style={styles.lessonType}>{lesson.type === 'video' ? 'Video' : 'Bài viết'} - {lesson.duration} phút</Text>
                                    </View>
                                    {lesson.isPreview && (
                                        <Icon name="play-circle-outline" size={24} color="#000" style={styles.playIcon} />
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}

            {/* Purchase Button */}
            <TouchableOpacity style={styles.purchaseButton}>
                <Text style={styles.purchaseButtonText}>Mua ngay</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    courseImage: {
        width: '100%',
        height: 200,
    },
    courseInfo: {
        padding: 16,
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    courseInstructor: {
        fontSize: 16,
        marginVertical: 8,
    },
    coursePrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff0000',
    },
    courseDescription: {
        fontSize: 16,
        marginVertical: 8,
    },
    sectionContainer: {
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lessonList: {
        paddingLeft: 16,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    lessonIndex: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    lessonDetails: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lessonType: {
        fontSize: 14,
        color: '#666',
    },
    playIcon: {
        marginLeft: 10,
    },
    purchaseButton: {
        backgroundColor: '#6a0dad',
        padding: 16,
        margin: 16,
        borderRadius: 8,
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CourseDetail;
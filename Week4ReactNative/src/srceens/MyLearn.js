import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import courseService from '../services/courseService';

const MyLearn = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const fetchStudentCourses = async () => {
        setLoading(true);
        try {
            const courseRequest = {
                createdBy: 'hungsam',
            };
            const studentCourses = await courseService.getAllCourseOfStudent(courseRequest);
            if (studentCourses) {
                setCourses(studentCourses);
            }
        } catch (error) {
            console.error('Error fetching student courses:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentCourses();
    }, []);

    const renderCourseItem = ({ item }) => (
        <View style={styles.courseContainer}>
            <Image source={{ uri: item.imagePreview }} style={styles.courseImage} />
            <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseAuthor}>{item.teacher}</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress || 0}%` }]} />
                </View>
                <Text style={styles.progressText}>{item.progress || 0}% complete</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PlayCourse', { courseId: item.id })}>
                    <Text style={styles.startCourse}>Start course</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

// StyleSheet for the components
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
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import courseService from '../services/courseService';
import { errorToast } from '../utils/methods';

const CourseCard = ({ course, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.courseCard}>
                <Image source={{ uri: course.imagePreview }} style={styles.courseImage} />
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.instructorText}>{course.createdBy}</Text>
                <Text style={styles.instructorText}>Số học viên: {course.countSale}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{course.price} đ</Text>
                    <Text style={styles.originalPriceText}>{course.originalPrice} đ</Text>
                </View>
                {course.bestSeller && (
                    <Text style={styles.bestSeller}>Bán chạy nhất</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const CourseList = ({ navigation }) => {
    const [bestSellerCourses, setBestSellerCourses] = useState([]);
    const [newCourses, setNewCourses] = useState([]);
    const [oldCourses, setOldCourses] = useState([]);
    const [highRatedCourses, setHighRatedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const [bestSellers, newCoursesData, oldCoursesData, highRated] = await Promise.all([
                    courseService.getCourse({ type: 'bestSeller' }),
                    courseService.getCourse({ type: 'new' }),
                    courseService.getCourse({ type: 'old' }),
                    courseService.getCourse({ type: 'highRated' }),
                ]);

                setBestSellerCourses(bestSellers);
                setNewCourses(newCoursesData);
                setOldCourses(oldCoursesData);
                setHighRatedCourses(highRated);
            } catch (error) {
                console.error('Error fetching courses:', error.message);
                errorToast('Không thể tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const goToCourseDetail = (course) => {
        navigation.navigate('CourseDetail', { course });
    };

    const renderCourseList = (title, data) => (
        <View style={styles.courseSection}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <CourseCard
                        course={item}
                        onPress={() => goToCourseDetail(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );

    return (
        <ScrollView>
            {renderCourseList("Bán chạy nhất", bestSellerCourses)}
            {renderCourseList("Khóa học mới", newCourses)}
            {renderCourseList("Khóa học cũ", oldCourses)}
            {renderCourseList("Đánh giá cao", highRatedCourses)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    courseSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    courseCard: {
        width: 250,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        height: 270,
    },
    courseImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    instructorText: {
        fontSize: 14,
        color: '#555',
        marginVertical: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e67e22',
        marginRight: 10,
    },
    originalPriceText: {
        fontSize: 14,
        textDecorationLine: 'line-through',
        color: '#999',
    },
    bestSeller: {
        marginTop: 5,
        fontSize: 14,
        backgroundColor: '#f4c150',
        color: '#fff',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
});

export default CourseList;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import courseService from '../services/courseService';
import { errorToast } from '../utils/methods';

const Rating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Icon key={`full-${i}`} name="star" size={16} color="#f5a623" />);
    }
    if (halfStar) {
        stars.push(<Icon key="half" name="star-half" size={16} color="#f5a623" />);
    }
    while (stars.length < 5) {
        stars.push(<Icon key={`empty-${stars.length}`} name="star-o" size={16} color="#f5a623" />);
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
};

const CourseCard = ({ course, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.courseCard}>
                <Image source={{ uri: course?.imagePreview }} style={styles.courseImage} />
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course?.title}</Text>
                    <Text style={styles.courseInstructor}>{course?.ownerUsername}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.courseRating}>{course?.rating}</Text>
                        <Rating rating={course?.rating} />
                        <Text style={styles.courseReviews}>({course?.ratingCount})</Text>
                    </View>
                    <Text style={styles.coursePrice}>{`${course?.price?.price} ₫`}</Text>
                    {course.bestSeller && (
                        <View style={styles.bestsellerBadge}>
                            <Text style={styles.bestsellerText}>Bestseller</Text>
                        </View>
                    )}
                </View>
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
            {renderCourseList("Best Seller", bestSellerCourses)}
            {renderCourseList("New Course", newCourses)}
            {renderCourseList("Old Course", oldCourses)}
            {renderCourseList("Top Rating", highRatedCourses)}
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
    courseInfo: {
        flex: 1,
        marginTop: 10, 
        justifyContent: 'space-between',
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    courseInstructor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    courseRating: {
        fontSize: 14,
        color: '#f5a623',
        marginRight: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    courseReviews: {
        fontSize: 12,
        color: '#666',
    },
    coursePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    bestsellerBadge: {
        backgroundColor: '#f5f5a3',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    bestsellerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CourseList;
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Để gọi API
import { getToken } from '../utils/authUtils'; // Hàm lấy token
import { BASE_URL } from '../utils/constants'; // URL API

const CourseCard = ({ course }) => {
    return (
        <View style={styles.courseCard}>
            <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.instructorText}>{course.createdBy}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{course.rating}</Text>
                <Icon name="star" size={14} color="#f4c150" />
                <Text style={styles.ratingsCount}>({course.ratingsCount})</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{course.price} đ</Text>
                <Text style={styles.originalPriceText}>{course.originalPrice} đ</Text>
            </View>
            {course.bestSeller && <Text style={styles.bestSeller}>Bán chạy nhất</Text>}
        </View>
    );
};

const CourseList = () => {
    const [courses, setCourses] = useState([]); // State để lưu danh sách khóa học
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const tokenStr = await getToken(); // Lấy token
                const response = await axios.get(`${BASE_URL}/courses`, {
                    headers: {
                        Authorization: `Bearer ${tokenStr}`,
                    },
                });
                setCourses(response.data); // Lưu dữ liệu API vào state
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses(); // Gọi API khi component được render
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị khi đang tải
    }

    return (
        <FlatList
            data={courses}
            renderItem={({ item }) => <CourseCard course={item} />}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
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
        height: 300,
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
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    ratingText: {
        fontSize: 14,
        marginRight: 5,
    },
    ratingsCount: {
        fontSize: 14,
        marginLeft: 5,
        color: '#555',
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

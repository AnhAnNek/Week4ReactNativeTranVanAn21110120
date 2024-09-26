import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Để gọi API
import { getToken } from '../utils/authUtils'; // Hàm lấy token
import { BASE_URL } from '../utils/constants'; // URL API

// Component quảng cáo
const PromotionBanner = () => {
    return (
        <View style={styles.promotionBanner}>
            <Image
                source={{ uri: 'https://www.shutterstock.com/image-photo/education-technology-ai-artificial-intelligence-600nw-2496843175.jpg' }} // Thay bằng link hình ảnh của bạn
                style={styles.promotionImage}
            />
            <View style={styles.promotionContent}>
                <Text style={styles.promotionTitle}>Top 10 best course</Text>
            </View>
        </View>
    );
};

const CourseCard = ({ course, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.courseCard}>
                <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
                {/* Đảm bảo bao bọc văn bản trong <Text> */}
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.instructorText}>{course.createdBy}</Text>
                <Text style={styles.instructorText}>Số học viên: {course.countSale}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{course.price} đ</Text>
                    <Text style={styles.originalPriceText}>{course.originalPrice} đ</Text>
                </View>
                {course.bestSeller && (
                    <TouchableOpacity onPress={onPress}>
                        {/* Đảm bảo bao bọc văn bản "Bán chạy nhất" trong <Text> */}
                        <Text style={styles.bestSeller}>Bán chạy nhất</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const CourseList = ({ navigation }) => {
    const [courses, setCourses] = useState([]); // State để lưu danh sách khóa học
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const tokenStr = await getToken(); // Lấy token
                const response = await axios.get(`${BASE_URL}/courses/top-10-sales`, {
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

    const goToCourseDetail = (course) => {
        navigation.navigate('CourseDetail', { course }); // Điều hướng tới trang chi tiết
    };

    return (
        <View>
            {/* Thêm banner quảng cáo ở trên */}
            <PromotionBanner />

            {/* Danh sách khóa học */}
            <FlatList
                data={courses}
                renderItem={({ item }) => (
                    <CourseCard
                        course={item}
                        onPress={() => goToCourseDetail(item)} // Truyền sự kiện onPress để điều hướng
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    promotionBanner: {
        backgroundColor: '#000',
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    promotionImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    promotionContent: {
        padding: 10,
        alignItems: 'center',
    },
    promotionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
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
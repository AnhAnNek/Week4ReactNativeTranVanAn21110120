import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import reviewService from '../services/reviewService'; // Import your review service
import AsyncStorage from '@react-native-async-storage/async-storage';

const RatingBar = ({percentage}) => (
  <View style={styles.ratingBarContainer}>
    <View style={styles.backgroundBar}>
      <View style={[styles.foregroundBar, {width: `${percentage}%`}]} />
    </View>
  </View>
);

const StarRating = ({rating, setRating}) => (
  <View style={styles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-o'}
        size={16}
        color="#f39c12"
        onPress={() => setRating && setRating(index + 1)} // Allow rating selection if setRating is provided
      />
    ))}
  </View>
);

const ReviewItem = ({item}) => (
  <View style={styles.reviewItem}>
    <Text style={styles.name}>{item.owner}</Text>
    <View style={styles.reviewHeader}>
      <StarRating rating={item.rating} />
    </View>
    <Text style={styles.comment}>{item.comment}</Text>
  </View>
);

const Review = ({courseId, buttonState}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState([
    {stars: 5, percentage: 0},
    {stars: 4, percentage: 0},
    {stars: 3, percentage: 0},
    {stars: 2, percentage: 0},
    {stars: 1, percentage: 0},
  ]);
  const [averageRating, setAverageRating] = useState(0);

  // State for new review
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRequest = {courseId};
        const response = await reviewService.getAllReviewByCourse(
          reviewRequest,
        );
        if (response) {
          setReviews(response);
          calculateRatingDistribution(response);
          calculateAverageRating(response);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  const saveCouponToStorage = async coupon => {
    try {
      const existingCoupons = await AsyncStorage.getItem('coupons');
      const parsedCoupons = existingCoupons ? JSON.parse(existingCoupons) : [];
      const updatedCoupons = [...parsedCoupons, coupon];
      await AsyncStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    } catch (error) {
      console.error('Error saving coupon to storage:', error);
    }
  };

  const calculateRatingDistribution = reviews => {
    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0];

    reviews.forEach(review => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1] += 1;
      }
    });

    const ratingPercentages = ratingCounts.map(count =>
      totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    );

    setRatingData([
      {stars: 5, percentage: ratingPercentages[4]},
      {stars: 4, percentage: ratingPercentages[3]},
      {stars: 3, percentage: ratingPercentages[2]},
      {stars: 2, percentage: ratingPercentages[1]},
      {stars: 1, percentage: ratingPercentages[0]},
    ]);
  };

  const calculateAverageRating = reviews => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / (reviews.length || 1); // To avoid division by zero
    setAverageRating(average.toFixed(1)); // Set the average rating (1 decimal place)
  };

  const handleAddReview = async () => {
    if (!newRating || !newComment.trim()) {
      Alert.alert('Error', 'Please provide both a rating and a comment.');
      return;
    }

    setSubmitting(true);

    try {
      const reviewRequest = {
        courseId,
        rating: newRating,
        comment: newComment,
        user: 'hungsam', // Replace with user info if available
      };

      const response = await reviewService.createReview(reviewRequest);

      if (response) {
        const enrichedResponse = {
          ...response,
          owner: 'hungsam', // Thêm user từ reviewRequest
        };
        // Sử dụng dữ liệu trả về từ API (response) để cập nhật danh sách reviews
        setReviews(prevReviews => [...prevReviews, enrichedResponse]);

        // Tính toán lại các chỉ số đánh giá
        calculateRatingDistribution([...reviews, enrichedResponse]);
        calculateAverageRating([...reviews, enrichedResponse]);
        const newCoupon = {
          id: Date.now().toString(), // Unique ID for coupon
          code: `COUPON${Math.floor(Math.random() * 100000)}`, // Random coupon code
          discount: Math.floor(Math.random() * 50) + 10, // Random discount between 10% and 60%
        };

        // Save coupon to AsyncStorage
        await saveCouponToStorage(newCoupon);

        // Notify user about the new coupon
        Alert.alert(
          'Success',
          `Review added successfully! You received a coupon: ${newCoupon.code} (${newCoupon.discount}% off).`,
        );
        // Reset form
        setNewComment('');
        setNewRating(0);

        Alert.alert('Success', 'Review added successfully!');
      } else {
        Alert.alert('Error', 'Failed to add review.');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert('Error', 'An error occurred while adding the review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student feedback</Text>
      <View style={styles.ratingSection}>
        <Text style={styles.ratingText}>
          <Text style={styles.ratingNumber}>{averageRating} </Text>course rating
        </Text>
        <View style={styles.ratingDetails}>
          {ratingData.map(item => (
            <View key={item.stars} style={styles.ratingRow}>
              <RatingBar percentage={item.percentage} />
              <StarRating rating={item.stars} />
              <Text style={styles.percentageText}>
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Add Review Section - Display only for "start-course" or "continue-course" */}
      {(buttonState === 'start-course' ||
        buttonState === 'continue-course') && (
        <View style={styles.addReviewSection}>
          <Text style={styles.addReviewHeader}>Add Your Review</Text>
          <StarRating rating={newRating} setRating={setNewRating} />
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <Button
            title={submitting ? 'Submitting...' : 'Submit Review'}
            onPress={handleAddReview}
            disabled={submitting}
          />
        </View>
      )}

      <FlatList
        data={reviews}
        renderItem={({item}) => <ReviewItem item={item} />}
        keyExtractor={item => item.id.toString()}
        style={styles.reviewList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 45,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingSection: {
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  ratingNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingDetails: {
    marginTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBarContainer: {
    width: 180,
    marginHorizontal: 10,
  },
  backgroundBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  foregroundBar: {
    height: '100%',
    backgroundColor: '#cccccc',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 100,
  },
  percentageText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  reviewList: {
    marginTop: 16,
  },
  reviewItem: {
    marginBottom: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    marginTop: 4,
    fontSize: 14,
    color: '#000',
  },
  addReviewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addReviewHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    height: 80,
    textAlignVertical: 'top',
  },
});

export default Review;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import reviewService from '../services/reviewService'; // Import your review service

const RatingBar = ({ percentage }) => (
  <View style={styles.ratingBarContainer}>
    <View style={styles.backgroundBar}>
      <View style={[styles.foregroundBar, { width: `${percentage}%` }]} />
    </View>
  </View>
);

const StarRating = ({ rating }) => (
  <View style={styles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-o'}
        size={16}
        color="#f39c12"
      />
    ))}
  </View>
);

const ReviewItem = ({ item }) => (
  <View style={styles.reviewItem}>
    <Text style={styles.name}>{item.owner}</Text>
    <View style={styles.reviewHeader}>
      <StarRating rating={item.rating} />
    </View>
    <Text style={styles.comment}>{item.comment}</Text>
  </View>
);

const Review = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState([
    { stars: 5, percentage: 0 },
    { stars: 4, percentage: 0 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 }
  ]);
  const [averageRating, setAverageRating] = useState(0); // State to store average rating

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewRequest = { courseId };
        const response = await reviewService.getAllReviewByCourse(reviewRequest);
        if (response) {
          setReviews(response);
          calculateRatingDistribution(response);
          calculateAverageRating(response); // Calculate average rating
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  const calculateRatingDistribution = (reviews) => {
    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0];

    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1] += 1;
      }
    });

    const ratingPercentages = ratingCounts.map((count) =>
      totalReviews > 0 ? (count / totalReviews) * 100 : 0
    );

    setRatingData([
      { stars: 5, percentage: ratingPercentages[4] },
      { stars: 4, percentage: ratingPercentages[3] },
      { stars: 3, percentage: ratingPercentages[2] },
      { stars: 2, percentage: ratingPercentages[1] },
      { stars: 1, percentage: ratingPercentages[0] },
    ]);
  };

  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / (reviews.length || 1); // To avoid division by zero
    setAverageRating(average.toFixed(1)); // Set the average rating (1 decimal place)
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
          {ratingData.map((item) => (
            <View key={item.stars} style={styles.ratingRow}>
              <RatingBar percentage={item.percentage} />
              <StarRating rating={item.stars} />
              <Text style={styles.percentageText}>{item.percentage.toFixed(1)}%</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
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
});

export default Review;

import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import sectionService from '../services/sectionService';
import lessonService from '../services/lessonService';
import cartService from '../services/cartService'; // Import cartService
import enrollmentService from '../services/enrollmentService'; // Import enrollmentService
import {errorToast, successToast} from '../utils/methods';
import Review from './Review';
import authService from '../services/authService';
import favouriteService from '../services/favouriteService';
import RenderHTML from 'react-native-render-html';

const Rating = ({rating}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FontAwesome key={`full-${i}`} name="star" size={16} color="#f5a623" />,
    );
  }

  if (halfStar) {
    stars.push(
      <FontAwesome key="half" name="star-half" size={16} color="#f5a623" />,
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FontAwesome
        key={`empty-${i}`}
        name="star-o"
        size={16}
        color="#f5a623"
      />,
    );
  }

  return <View style={styles.ratingContainer}>{stars}</View>;
};

const CourseDetail = ({route, navigation}) => {
  const {course} = route.params;
  const courseId = course.id; // Assuming the course object has an ID field
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isFixed, setIsFixed] = useState(false);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lessons, setLessons] = useState({});
  const [totalLessons, setTotalLessons] = useState(0);
  const [user, setUser] = useState(null);
  const [buttonState, setButtonState] = useState('loading'); // New state for button

  const handleAddToFavorite = async () => {
    setLoadingFavorite(true);

    try {
      const result = await favouriteService.addFavourite(courseId);
      if (result) {
        setIsFavorite(true);
        successToast('Course added to favorites.');
      } else {
        errorToast('Unable to add course to favorites.');
      }
    } catch (error) {
      errorToast('An error occurred while adding to favorites.');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleRemoveFromFavorite = async () => {
    setLoadingFavorite(true);
    try {
      console.log('course.id', course.id);
      await favouriteService.deleteFavourite(course.id);
      setIsFavorite(false);
      successToast('Course removed from favorites.');
    } catch (error) {
      errorToast('An error occurred while removing from favorites.');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const result = await favouriteService.checkCourseInFavourite(courseId);
      setIsFavorite(result);
    } catch (error) {
      errorToast('An error occurred while checking favorite status.');
    }
  };

  const fetchUserByToken = async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurUser();
      setUser(userData);
    } catch (error) {
      errorToast('An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsAndLessons = async () => {
    try {
      const sectionData = await sectionService.getAllSectionByCourse({
        courseId: course.id,
      });
      if (sectionData) {
        setSections(sectionData);

        let lessonsData = {};
        let totalLessonsCount = 0;

        for (const section of sectionData) {
          const lessonData = await lessonService.getAllLessonBySection({
            sectionId: section.id,
          });
          if (lessonData) {
            lessonsData[section.id] = lessonData;
            totalLessonsCount += lessonData.length;
          }
        }

        setLessons(lessonsData);
        setTotalLessons(totalLessonsCount);
      } else {
        errorToast('Unable to load sections.');
      }
    } catch (error) {
      errorToast('An error occurred while fetching sections and lessons.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle button click based on the state
  const handleButtonClick = async () => {
    switch (buttonState) {
      case 'add-to-cart':
        try {
          await cartService.addItemToCart(courseId);
          successToast('Course added to cart');
          setButtonState('in-cart');
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
        break;
      case 'start-course':
      case 'continue-course':
        navigation.navigate('Play Course', {courseId});
        break;
      case 'in-cart':
        navigation.navigate('Cart');
        break;
      default:
        break;
    }
  };

  // Check if the course can be added to the cart or if the user is enrolled
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const canAdd = await cartService.canAddToCart(courseId);
        if (canAdd) {
          setButtonState('add-to-cart');
        } else {
          const enrollment = await enrollmentService.isEnrolled(courseId);
          if (enrollment && enrollment.progress === 0) {
            setButtonState('start-course');
          } else if (enrollment && enrollment.progress > 0) {
            setButtonState('continue-course');
          }
        }
      } catch (error) {
        setButtonState('in-cart');
      }
    };

    if (course) {
      checkEnrollmentStatus();
    }
  }, [course]);

  useEffect(() => {
    const fetchUserAndCheckFavorite = async () => {
      await fetchUserByToken();
      await checkIfFavorite();
    };

    fetchUserAndCheckFavorite();
  }, [course.id]);

  useEffect(() => {
    fetchSectionsAndLessons();
  }, [course.id]);

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsFixed(offsetY > 400);
  };

  const toggleSection = sectionId => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const handleChatButtonPress = () => {
    navigation.navigate('Message Detail', {
      senderUsername: user.username || '',
      recipientUsername: course?.owner?.username || '',
      recipientAvatar: course?.owner?.avatarPath || '',
      recipientFullName: course?.owner?.fullName || '',
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 5 : 0;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}>
        <Image source={{uri: course.imagePreview}} style={styles.courseImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>
            {course.descriptionPreview}
          </Text>

          <Text style={styles.bestsellerBadge}>Bestseller</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.courseRating}>{course.rating.toFixed(1)}</Text>
            <Rating rating={course.rating} />
            <Text style={styles.courseReviews}>
              ({course.ratingCount} ratings)
            </Text>
          </View>

          <Text style={styles.instructor}>
            Instructor: {course.ownerUsername}
          </Text>
          <Text style={styles.instructor}>
            Student: {course.countStudent || 5}
          </Text>
          <Text style={styles.lastUpdated}>Last updated: 2024/08</Text>
          <Text style={styles.languages}>
            Languages: English, Vietnamese, etc.
          </Text>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>{course.price.price} đ</Text>

          {/* Button based on the state */}
          <TouchableOpacity
            style={styles.buttonBuy}
            onPress={handleButtonClick}
            disabled={buttonState === 'loading'}>
            <Text style={styles.buttonText}>
              {buttonState === 'add-to-cart' && 'Add to cart'}
              {buttonState === 'start-course' && 'Start Course'}
              {buttonState === 'continue-course' && 'Continue Course'}
              {buttonState === 'in-cart' && 'In Cart'}
            </Text>
          </TouchableOpacity>

          {loadingFavorite ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : isFavorite ? (
            <TouchableOpacity
              style={styles.buttonWishlist}
              onPress={handleRemoveFromFavorite}>
              <Text style={styles.buttonText1}>Remove from wishlist</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonWishlist}
              onPress={handleAddToFavorite}>
              <Text style={styles.buttonText1}>Add to wishlist</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sections and Lessons */}
        {sections.map(section => (
          <View key={section.id} style={styles.sectionContainer}>
            <TouchableOpacity
              onPress={() => toggleSection(section.id)}
              style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Icon
                name={
                  expandedSections.includes(section.id)
                    ? 'remove-circle-outline'
                    : 'add-circle-outline'
                }
                size={24}
                color="#000"
              />
            </TouchableOpacity>

            {expandedSections.includes(section.id) && (
              <View style={styles.lessonList}>
                {lessons[section.id]?.map((lesson, lessonIndex) => (
                  <View key={lesson.id} style={styles.lessonItem}>
                    <Text style={styles.lessonIndex}>{lessonIndex + 1}</Text>
                    <View style={styles.lessonDetails}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonType}>
                        {lesson.type === 'video' ? 'Video' : 'Article'} -{' '}
                        {lesson.duration} minutes
                      </Text>
                    </View>
                    {lesson.isPreview && (
                      <Icon
                        name="play-circle-outline"
                        size={24}
                        color="#000"
                        style={styles.playIcon}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* This Course Includes Section */}
        <View style={styles.courseIncludes}>
          <Text style={styles.courseIncludesTitle}>This course includes</Text>
          <View style={styles.courseIncludesItem}>
            <Icon name="time-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>
              {course.duration} minutes
            </Text>
          </View>
          <View style={styles.courseIncludesItem}>
            <Icon name="book-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>
              {sections.length} Sections
            </Text>
          </View>
          <View style={styles.courseIncludesItem}>
            <Icon name="videocam-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>
              {totalLessons} Lessons
            </Text>
          </View>
          <View style={styles.courseIncludesItem}>
            <Icon name="infinite-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>Full lifetime access</Text>
          </View>
          <View style={styles.courseIncludesItem}>
            <Icon name="phone-portrait-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>
              Access on mobile, desktop, and TV
            </Text>
          </View>
          <View style={styles.courseIncludesItem}>
            <Icon name="ribbon-outline" size={20} color="#000" />
            <Text style={styles.courseIncludesText}>
              Certificate of completion
            </Text>
          </View>
        </View>

        {/* Course Full Description */}
        <View style={styles.courseDescriptionSection}>
          <Text style={styles.courseDescriptionTitle}>Description</Text>
          <RenderHTML
            contentWidth={13}
            source={{html: course.description}} // Assuming descriptionPreview contains HTML
            baseStyle={styles.courseDescriptionFull}
          />
        </View>

        {/* Reviews */}
        <Review courseId={course.id} buttonState={buttonState} />
      </ScrollView>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleChatButtonPress}>
        <Icon name="chatbubble-ellipses-outline" size={30} color="#fff" />
      </TouchableOpacity>
      {isFixed && (
        <Animated.View style={styles.fixedFooter}>
          <Text style={styles.price}>{course?.price?.price} đ</Text>
          <TouchableOpacity
            style={styles.buttonBuySmall}
            onPress={handleButtonClick}>
            <Text style={styles.buttonText}>
              {buttonState === 'add-to-cart' && 'Add to cart'}
              {buttonState === 'start-course' && 'Start Course'}
              {buttonState === 'continue-course' && 'Continue Course'}
              {buttonState === 'in-cart' && 'In Cart'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  courseImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  bestsellerBadge: {
    backgroundColor: '#ffd700',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5a623',
    marginRight: 5,
  },
  courseReviews: {
    fontSize: 14,
    color: '#555',
  },
  instructor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  languages: {
    fontSize: 14,
    color: '#999',
  },
  priceSection: {
    padding: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonBuy: {
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonWishlist: {
    borderColor: '#555',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginVertical: 0,
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
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonBuySmall: {
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  courseIncludes: {
    padding: 16,
  },
  courseIncludesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseIncludesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseIncludesText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  courseDescriptionSection: {
    padding: 16,
  },
  courseDescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseDescriptionFull: {
    fontSize: 16,
    color: '#555',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#a855f7',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
  },
});

export default CourseDetail;

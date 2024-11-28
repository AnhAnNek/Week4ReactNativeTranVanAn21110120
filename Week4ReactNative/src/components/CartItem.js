import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

const CartItem = ({cartItem, handleRemoveFromCart}) => {
  const navigation = useNavigation();

  const handleCoursePress = () => {
    // Navigate to CourseDetail screen with the course data
    navigation.navigate('Course Detail', {course: cartItem.course});
  };
  const handleDelete = () => {
    // Show confirmation alert before removing the item
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => handleRemoveFromCart(cartItem?.id),
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      onPress={handleCoursePress}
      style={styles.container}
      key={cartItem.id}>
      <Image
        source={{uri: cartItem?.course?.imagePreview}}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {cartItem?.course?.title}
        </Text>

        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {cartItem?.course?.descriptionPreview}
        </Text>

        <Text style={styles.teacher}>
          Teacher: {cartItem?.course?.ownerUsername}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(cartItem?.price)}
          </Text>
          <TouchableOpacity onPress={handleDelete}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: 'white',
    marginBottom: 12,
    alignItems: 'center',
    borderColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  teacher: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    marginRight: 16,
  },
});

export default CartItem;

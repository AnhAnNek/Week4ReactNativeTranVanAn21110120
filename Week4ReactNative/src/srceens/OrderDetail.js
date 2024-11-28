import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import orderService from '../services/orderService';
import {useNavigation} from '@react-navigation/native';

const OrderDetail = ({route}) => {
  const {orderId} = route.params;
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderItemsByOrderId(orderId);
        setOrderDetail(response);
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleCoursePress = course => {
    // Navigate to the CourseDetail screen and pass the course data
    navigation.navigate('Course Detail', {course});
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!orderDetail || !orderDetail.content) {
    return <Text>No order details available.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.orderCard}>
          <Text style={styles.orderId}>Order ID: {orderId}</Text>
          <Text style={styles.amount}>
            Total Amount: {orderDetail.totalElements} items
          </Text>
          <Text style={styles.createdAt}>
            Created At:{' '}
            {new Date(orderDetail.content[0].course.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {orderDetail.content.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemCard}
            onPress={() => handleCoursePress(item.course)}>
            <View style={styles.itemContent}>
              <Image
                source={{uri: item.course.imagePreview}}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <View style={styles.textContent}>
                <Text style={styles.itemTextBold}>
                  Course: {item.course.title}
                </Text>
                {/* Safely display price in VND */}
                {item.price !== undefined && (
                  <Text style={styles.itemText}>
                    Price:{' '}
                    {item.price.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </Text>
                )}

                {item.discountPercent > 0 && (
                  <Text style={styles.itemTextHighlight}>
                    Discount: {item.discountPercent}%
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTextHighlight: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 4,
  },
});

export default OrderDetail;

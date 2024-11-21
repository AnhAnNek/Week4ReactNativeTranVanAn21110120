import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);

  const getCouponsFromStorage = async () => {
    try {
      const existingCoupons = await AsyncStorage.getItem('coupons');
      return existingCoupons ? JSON.parse(existingCoupons) : [];
    } catch (error) {
      console.error('Error fetching coupons from storage:', error);
      return [];
    }
  };
  useEffect(() => {
    const fetchCoupons = async () => {
      const storedCoupons = await getCouponsFromStorage();
      setCoupons(storedCoupons);
    };

    fetchCoupons();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.couponContainer}>
      <Text style={styles.couponCode}>Code: {item.code}</Text>
      <Text style={styles.couponDiscount}>Discount: {item.discount}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Coupons</Text>
      <FlatList
        data={coupons}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  couponContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  couponDiscount: {
    fontSize: 14,
    color: '#16a085',
    marginTop: 4,
  },
});

export default CouponList;

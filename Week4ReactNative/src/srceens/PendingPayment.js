import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {errorToast, successToast} from '../utils/methods';
import paymentService from '../services/paymentService';

const PendingPayment = ({navigation, route}) => {
  const {orderId} = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const paymentResponse = await paymentService.simulatePaymentSuccess(
        orderId,
      );
      const status = paymentResponse?.status;
      if (status === 'SUCCESS') {
        setPaymentStatus('SUCCESS');
        successToast('Payment simulated successfully');
        setTimeout(() => {
          navigation.navigate('My Learn');
        }, 5000);
      } else if (status === 'FAILED') {
        setPaymentStatus('FAILED');
        errorToast('Payment failed');
      }
    } catch (error) {
      console.error(error?.message);
      setPaymentStatus('FAILED');
      errorToast('Error simulating payment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return 'green';
      case 'FAILED':
        return 'red';
      default:
        return '#555';
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00BFFF" />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.heading}>Pending Payment</Text>
          {paymentStatus === 'SUCCESS' && (
            <Image
              source={{
                uri: 'https://res.cloudinary.com/dq7y35u7s/image/upload/v1732725606/azk2yjngkjzkulzyrm1n.png',
              }}
              style={styles.image}
            />
          )}
          <Text style={styles.orderIdText}>Order ID: {orderId}</Text>

          <Text style={[styles.statusText, {color: getStatusColor()}]}>
            Payment Status: {paymentStatus}
          </Text>

          {paymentStatus === 'PENDING' && (
            <Button
              title="Simulate Payment Success"
              onPress={handleSimulatePayment}
              color="#FF6347"
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  orderIdText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
});

export default PendingPayment;

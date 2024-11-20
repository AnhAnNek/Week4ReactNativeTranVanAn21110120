import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { errorToast, successToast } from "../utils/methods";
import paymentService from '../services/paymentService';

const PendingPayment = ({ navigation, route }) => {
  const { orderId } = route.params;  // Extract order ID from route params
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');  // Initial status is PENDING

  // Function to simulate payment success on button press
  const handleSimulatePayment = async () => {
    setLoading(true);  // Show loader while simulating payment
    try {
      const paymentResponse = await paymentService.simulatePaymentSuccess(orderId);
      const status = paymentResponse?.status;
      if (status === 'SUCCESS') {
        setPaymentStatus('SUCCESS');
        successToast('Payment simulated successfully');
        navigation.navigate('History');  // Navigate to History after successful payment
      } else if (status === 'FAILED') {
        setPaymentStatus('FAILED');
        errorToast('Payment failed');
      }
    } catch (error) {
      console.error(error?.message);
      setPaymentStatus('FAILED');  // Assume failed if there's an error
      errorToast('Error simulating payment');
    } finally {
      setLoading(false);  // Hide loader after the process
    }
  };

  // Determine the color for the payment status dynamically
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

          {/* Display the Order ID */}
          <Text style={styles.orderIdText}>Order ID: {orderId}</Text>

          {/* Display the Payment Status */}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            Payment Status: {paymentStatus}
          </Text>

          {/* Button to simulate payment success */}
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
    backgroundColor: '#F5F5F5',  // Light gray background
    justifyContent: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  content: {
    backgroundColor: '#fff',  // White card background
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,  // For Android shadow
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
});

export default PendingPayment;
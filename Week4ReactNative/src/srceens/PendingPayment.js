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
  const { orderId } = route.params;  // Extract the orderId from route params
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Function to simulate payment success on button press
  const handleSimulatePayment = async () => {
    setLoading(true);  // Show loader while simulating payment
    try {
      const status = await paymentService.simulatePaymentSuccess(orderId);
      setPaymentStatus(status);
      successToast('Payment simulated successfully');
    } catch (error) {
      console.error(error?.message);
      errorToast('Error simulating payment');
    } finally {
      setLoading(false);  // Hide loader after the process
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
          {paymentStatus ? (
            <Text style={styles.statusText}>
              Payment Status: {paymentStatus}
            </Text>
          ) : (
            <Text style={styles.statusText}>
              Payment Status: Pending
            </Text>
          )}

          {/* Button to simulate payment success */}
          <Button
            title="Simulate Payment Success"
            onPress={handleSimulatePayment}
            color="#FF6347"
          />
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
    color: paymentStatus === 'success' ? 'green' : '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PendingPayment;
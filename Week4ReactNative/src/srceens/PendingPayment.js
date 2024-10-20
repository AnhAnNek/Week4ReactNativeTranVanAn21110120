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
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const status = await paymentService.simulatePaymentSuccess(orderId);
        setPaymentStatus(status);
        successToast('Payment status fetched successfully');
      } catch (error) {
        console.error(error?.message);
        errorToast('Error fetching payment status');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setPaymentStatus(null);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.heading}>Pending Payment</Text>
          {paymentStatus ? (
            <Text style={styles.statusText}>
              Payment Status: {paymentStatus}
            </Text>
          ) : (
            <Text style={styles.errorText}>
              Unable to fetch payment status. Please try again.
            </Text>
          )}

          <Button
            title="Simulate payment success"
            onPress={() => paymentService.simulatePaymentSuccess(orderId)}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  content: {
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: 'green',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
});

export default PendingPayment;

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { errorToast, successToast } from "../utils/methods";
import cartService from "../services/cartService";
import paymentService from '../services/paymentService';
import CartItem from "../components/CartItem";
import { getUsername } from "../utils/authUtils";

const Cart = ({ navigation }) => {
    const [cart, setCart] = useState({
        id: 1,
        totalAmount: 150.75,
        updatedAt: '2024-10-04T02:31:21.787Z',
        username: 'john_doe',
        items: [
            {
                id: 1001,
                status: 'ACTIVE',
                price: 99.99,
                discountPercent: 10,
                updatedAt: '2024-10-04T02:31:21.787Z',
                courseId: 200,
                cartId: 1,
            },
        ],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
          const resolvedUsername = await getUsername();
            const cart = await cartService.getCart(resolvedUsername);
            setCart(cart);
        } catch (error) {
            console.error(error?.message);
            errorToast('Error fetching courses in the cart');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (courseId) => {
        try {
            await cartService.removeItemFromCart(courseId);
            successToast('Course removed from cart');
            await fetchCart();
        } catch (error) {
            console.error(error?.message);
            errorToast('Error removing course from cart');
        }
    };

    const handleCheckout = async () => {
        try {
            const resolvedUsername = await getUsername();
            const paymentRequest = {
                username: resolvedUsername,
                method: 'VN_PAY',
                urlReturn: 'http://localhost:3000',
            };

            console.log(`paymentRequest: ${JSON.stringify(paymentRequest)}`);

            const paymentResponse = await paymentService.createPaymentOrder(paymentRequest);
            const orderId = paymentResponse?.orderId;
            successToast('Checkout successful! Redirecting to pending payment...');

            // Pass the actual orderId when navigating to PendingPayment
            navigation.navigate('PendingPayment', { orderId });
        } catch (error) {
            console.error(error?.message);
            errorToast('Error during checkout. Please try again.');
        }
    };

    return (
      <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.heading}>Course Cart</Text>

              {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" />
                </View>
              ) : (
                <View style={styles.itemsContainer}>
                    {cart.items === null || cart.items.length === 0 ? (
                      <Text style={styles.emptyCartText}>
                          Your cart is empty.
                      </Text>
                    ) : (
                      cart.items.map((cartItem) => (
                        <CartItem
                          key={cartItem.id}
                          cartItem={cartItem}
                          handleRemoveFromCart={handleRemoveFromCart}
                        />
                      ))
                    )}
                </View>
              )}

              <Text style={styles.totalAmount}>
                  Total: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
              }).format(cart?.totalAmount)}
              </Text>

              <Button
                disabled={!cart?.items || cart.items?.length <= 0}
                title="Checkout"
                color="#00BFFF" // Cyan color
                onPress={handleCheckout}
              />
          </ScrollView>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'left',
    },
    loader: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    itemsContainer: {
        marginTop: 16,
    },
    emptyCartText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
    },
});

export default Cart;
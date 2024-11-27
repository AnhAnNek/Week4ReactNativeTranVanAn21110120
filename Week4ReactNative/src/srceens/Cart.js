import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Import Dropdown Picker
import {errorToast, successToast} from '../utils/methods';
import cartService from '../services/cartService';
import paymentService from '../services/paymentService';
import CartItem from '../components/CartItem';
import {getUsername} from '../utils/authUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({navigation}) => {
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
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponOptions, setCouponOptions] = useState([]); // Dropdown options for coupons
  const [open, setOpen] = useState(false); // Dropdown open state
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Selected coupon
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchCoupons(); // Fetch coupons on component mount
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

  const getCouponsFromStorage = async () => {
    try {
      const existingCoupons = await AsyncStorage.getItem('coupons');
      return existingCoupons ? JSON.parse(existingCoupons) : [];
    } catch (error) {
      console.error('Error fetching coupons from storage:', error);
      return [];
    }
  };

  const fetchCoupons = async () => {
    try {
      const existingCoupons = await AsyncStorage.getItem('coupons');
      const coupons = existingCoupons ? JSON.parse(existingCoupons) : [];
      setCouponOptions(
        coupons.map(coupon => ({
          label: `${coupon.code} - ${coupon.discount}%`, // Display coupon code and discount
          value: coupon.code, // Use coupon code as the value
        })),
      );
    } catch (error) {
      console.error('Error fetching coupons from storage:', error);
    }
  };

  const handleRemoveFromCart = async courseId => {
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

      const paymentResponse = await paymentService.createPaymentOrder(
        paymentRequest,
      );
      const orderId = paymentResponse?.orderId;
      
      const storedCoupons = await getCouponsFromStorage();

      const updatedCoupons = storedCoupons.filter(
        coupon => coupon.code.toUpperCase() !== discountCode.toUpperCase(),
      );
      await AsyncStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      successToast('Checkout successful! Redirecting to pending payment...');

      navigation.navigate('Pending Payment', {orderId});
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout. Please try again.');
    }
  };

  const handleApplyDiscount = async () => {
    try {
      if (!selectedCoupon) {
        errorToast('Please select a valid coupon.');
        return;
      }

      console.log(`Selected coupon: ${selectedCoupon}`);
      const storedCoupons = await getCouponsFromStorage();
      console.log(`Stored coupons: ${JSON.stringify(storedCoupons)}`);
      const validCoupon = storedCoupons.find(
        coupon => coupon.code.toUpperCase() === selectedCoupon.toUpperCase(),
      );

      if (!validCoupon) {
        errorToast('Invalid coupon. Please try again.');
        return;
      }

      const discountAmount = (cart.totalAmount * validCoupon.discount) / 100;
      setAppliedDiscount(discountAmount);
      successToast(
        `Discount applied! You saved ${new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(discountAmount)}.`,
      );
    } catch (error) {
      errorToast('Error applying discount. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCart(); // Fetch notifications again
    await fetchCoupons();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{right: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {cart.items === null || cart.items.length === 0 ? (
              <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            ) : (
              cart.items.map(cartItem => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </View>
        )}

        <View style={styles.discountContainer}>
          <DropDownPicker
            open={open}
            value={selectedCoupon}
            items={couponOptions}
            setOpen={setOpen}
            setValue={setSelectedCoupon}
            placeholder="Select a coupon"
            style={styles.discountInput}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          <Button
            title="Apply Coupon"
            color="#28a745"
            onPress={handleApplyDiscount}
          />
        </View>

        <Text style={styles.totalAmount}>
          Total:{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(cart?.totalAmount - appliedDiscount)}
        </Text>

        <Button
          disabled={!cart?.items || cart.items?.length <= 0}
          title="Checkout"
          color="#00BFFF"
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
  discountContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dropdownContainer: {
    marginTop: 5,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Cart;

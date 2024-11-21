import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
} from "react-native";
import { errorToast, successToast } from "../utils/methods";
import cartService from "../services/cartService";
import paymentService from "../services/paymentService";
import CartItem from "../components/CartItem";
import { getUsername } from "../utils/authUtils";

const Cart = ({ navigation }) => {
    const [cart, setCart] = useState({
        id: 1,
        totalAmount: 150.75,
        updatedAt: "2024-10-04T02:31:21.787Z",
        username: "john_doe",
        items: [
            {
                id: 1001,
                status: "ACTIVE",
                price: 99.99,
                discountPercent: 10,
                updatedAt: "2024-10-04T02:31:21.787Z",
                courseId: 200,
                cartId: 1,
            },
        ],
    });
    const [loading, setLoading] = useState(false);
    const [discountCode, setDiscountCode] = useState(""); // State để lưu mã giảm giá
    const [appliedDiscount, setAppliedDiscount] = useState(0); // Lưu giảm giá đã áp dụng

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
            errorToast("Error fetching courses in the cart");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (courseId) => {
        try {
            await cartService.removeItemFromCart(courseId);
            successToast("Course removed from cart");
            await fetchCart();
        } catch (error) {
            console.error(error?.message);
            errorToast("Error removing course from cart");
        }
    };

    const handleCheckout = async () => {
        try {
            const resolvedUsername = await getUsername();
            const paymentRequest = {
                username: resolvedUsername,
                method: "VN_PAY",
                urlReturn: "http://localhost:3000",
            };

            console.log(`paymentRequest: ${JSON.stringify(paymentRequest)}`);

            const paymentResponse = await paymentService.createPaymentOrder(
                paymentRequest
            );
            const orderId = paymentResponse?.orderId;
            successToast("Checkout successful! Redirecting to pending payment...");

            // Pass the actual orderId when navigating to PendingPayment
            navigation.navigate("PendingPayment", { orderId });
        } catch (error) {
            console.error(error?.message);
            errorToast("Error during checkout. Please try again.");
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

    const handleApplyDiscount = () => {
        try {
            // Load danh sách mã giảm giá từ localStorage
            const discountList = getCouponsFromStorage();

            // Tìm mã giảm giá hợp lệ
            const discount = discountList.find(
                (item) => item.code === discountCode.trim()
            );

            if (discount) {
                const discountValue = discount.discount; // Giả sử `discount` trong object là phần trăm giảm
                const discountAmount = (cart.totalAmount * discountValue) / 100;

                setAppliedDiscount(discountAmount);
                successToast(`Mã giảm giá "${discountCode}" đã được áp dụng!`);
            } else {
                errorToast("Mã giảm giá không hợp lệ!");
            }
        } catch (error) {
            console.error("Error applying discount:", error);
            errorToast("Có lỗi xảy ra khi áp dụng mã giảm giá!");
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
                            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
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

                {/* Ô nhập mã giảm giá */}
                <View style={styles.discountContainer}>
                    <TextInput
                        style={styles.discountInput}
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChangeText={setDiscountCode}
                    />
                    <Button
                        title="Áp dụng"
                        color="#28a745" // Green color
                        onPress={handleApplyDiscount}
                    />
                </View>

                <Text style={styles.totalAmount}>
                    Tổng cộng:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(cart?.totalAmount - appliedDiscount)}
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
        backgroundColor: "#fff",
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "left",
    },
    loader: {
        justifyContent: "center",
        alignItems: "center",
        height: 200,
    },
    itemsContainer: {
        marginTop: 16,
    },
    emptyCartText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
    },
    discountContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    discountInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
});

export default Cart;

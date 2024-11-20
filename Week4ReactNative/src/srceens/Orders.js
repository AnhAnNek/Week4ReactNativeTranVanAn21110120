import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import orderService from '../services/orderService';
import { successToast, errorToast } from '../utils/methods';
import authService from "../services/authService";

const Orders = () => {
    const user = authService.getCurUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All'); // Default tab
    const [totalAmount, setTotalAmount] = useState(null); // State for total amount

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchTotalAmount(activeTab);
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const fetchedOrders = await orderService.getOrders(user?.username, 0, 100);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error(error?.message);
            setOrders([]);
            errorToast('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalAmount = async (status) => {
        try {
            const response = await orderService.getTotalAmount(status);
            console.log(`getTotalAmount: ${JSON.stringify(response?.totalAmounts)}`)
            if (response) {
                setTotalAmount(response?.totalAmount);
            } else {
                setTotalAmount(null);
            }
        } catch (error) {
            console.error('Error fetching total amount:', error);
            setTotalAmount(null);
        }
    };

    const handleRateOrder = (orderId) => {
        successToast(`Rate order ${orderId}`);
        // Navigate to rate order screen (or trigger rating modal)
    };

    const renderOrderItem = (order) => {
        return (
          <View key={order.id} style={styles.orderContainer}>
              <View style={styles.storeHeader}>
                  <Text style={styles.storeLabel}>Yêu thích+</Text>
                  <Text style={styles.storeName}>{order.storeName}</Text>
                  <Text style={styles.orderStatus}>Completed</Text>
              </View>

              {order.items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemVariant}>{item.variant}</Text>
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    </View>
                    <View style={styles.itemPriceContainer}>
                        {item.discountedPrice && (
                          <Text style={styles.itemOldPrice}>
                              ₫{item.originalPrice.toLocaleString('vi-VN')}
                          </Text>
                        )}
                        <Text style={styles.itemPrice}>
                            ₫{item.discountedPrice.toLocaleString('vi-VN')}
                        </Text>
                    </View>
                </View>
              ))}

              <View style={styles.orderSummary}>
                  <Text style={styles.totalItems}>{order.items.length} items</Text>
                  <Text style={styles.orderTotal}>
                      Order Total: ₫{order.totalAmount.toLocaleString('vi-VN')}
                  </Text>
              </View>

              <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryStatus}>Giao hàng thành công</Text>
                  <TouchableOpacity onPress={() => handleRateOrder(order.id)}>
                      <Text style={styles.rateButton}>Rate now and get 200 coins</Text>
                  </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.rateOrderButton} onPress={() => handleRateOrder(order.id)}>
                  <Text style={styles.rateButtonText}>Rate</Text>
              </TouchableOpacity>
          </View>
        );
    };

    return (
      <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.heading}>My Purchases</Text>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                  {['All', 'Paid', 'Failed', 'Refunded'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                          styles.tabButton,
                          activeTab === tab && styles.activeTabButton,
                      ]}
                      onPress={() => setActiveTab(tab)}
                    >
                        <Text
                          style={[
                              styles.tabButtonText,
                              activeTab === tab && styles.activeTabButtonText,
                          ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                  ))}
              </View>

              {/* Total Amount */}
              <View style={styles.totalAmountContainer}>
                  <Text style={styles.totalAmountText}>
                      {totalAmount !== null
                        ? `Total Amount for ${activeTab} orders: ₫${totalAmount.toLocaleString('vi-VN')}`
                        : 'Fetching total amount...'}
                  </Text>
              </View>

              {/* Orders List */}
              {loading ? (
                <View style={styles.loader}>
                    <Text>Loading orders...</Text>
                </View>
              ) : (
                <View style={styles.ordersList}>
                    {orders.length === 0 ? (
                      <Text style={styles.emptyOrdersText}>
                          No orders found.
                      </Text>
                    ) : (
                      orders
                        .filter((order) => order.status === activeTab)
                        .map(renderOrderItem)
                    )}
                </View>
              )}
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF4500',
    },
    tabButtonText: {
        fontSize: 16,
        color: '#555',
    },
    activeTabButtonText: {
        color: '#FF4500',
        fontWeight: 'bold',
    },
    loader: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    ordersList: {
        marginTop: 20,
    },
    emptyOrdersText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
    },
    orderContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    storeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    storeLabel: {
        backgroundColor: '#FF6347',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 12,
    },
    storeName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderStatus: {
        color: '#FF4500',
        fontSize: 14,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemVariant: {
        fontSize: 12,
        color: '#888',
    },
    itemQuantity: {
        fontSize: 12,
        color: '#555',
    },
    itemPriceContainer: {
        alignItems: 'flex-end',
    },
    itemOldPrice: {
        textDecorationLine: 'line-through',
        color: '#888',
        fontSize: 12,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalItems: {
        fontSize: 14,
        color: '#555',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4500',
    },
    deliveryInfo: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deliveryStatus: {
        fontSize: 14,
        color: '#555',
    },
    rateButton: {
        fontSize: 14,
        color: '#FF6347',
        textDecorationLine: 'underline',
    },
    rateOrderButton: {
        marginTop: 10,
        backgroundColor: '#FF4500',
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    rateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalAmountContainer: {
        marginVertical: 10,
    },
    totalAmountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4500',
    },
});

export default Orders;
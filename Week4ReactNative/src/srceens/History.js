import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import orderService from '../services/orderService'; // Ensure the correct path to the service

const OrderStatus = ({ status }) => {
    let backgroundColor;
    let text;

    switch (status) {
        case 'PENDING_PAYMENT':
            backgroundColor = '#FFC107';
            text = 'PENDING_PAYMENT';
            break;
        case 'PAID':
            backgroundColor = '#4CAF50';
            text = 'PAID';
            break;
        case 'FAILED':
            backgroundColor = '#F44336';
            text = 'FAILED';
            break;
        case 'REFUNDED':
            backgroundColor = '#9E9E9E';
            text = 'REFUNDED';
            break;
        default:
            backgroundColor = '#000';
            text = 'UNKNOWN';
    }

    return (
        <View style={[styles.statusContainer, { backgroundColor }]}>
            <Text style={styles.statusText}>{text}</Text>
        </View>
    );
};

const OrderScreen = () => {
    const [selectedTab, setSelectedTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation(); // Use navigation hook

    // Function to fetch orders
    const fetchOrders = async (status) => {
        setLoading(true);  // Show loading while fetching data
        try {
            let response;
            if (status === 'All') {
                response = await orderService.getOrders('hungsam'); // Fetch all orders
            } else {
                response = await orderService.getOrdersByStatus('hungsam', status); // Fetch orders by status
            }
            setOrders(response?.content || []);  // Update orders list
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);  // Hide loading when data is fetched
        }
    };

    // Fetch orders when the component mounts or when selectedTab changes
    useEffect(() => {
        fetchOrders(selectedTab);
    }, [selectedTab]);

    const renderOrders = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#0000ff" />;
        }
        if (orders.length === 0) {
            return <Text>No orders available.</Text>;
        }
        return orders.map((order) => (
            <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })} // Navigate to OrderDetail with orderId
            >
                <Text style={styles.orderId}>Order ID: {order.id}</Text>
                <Text style={styles.amount}>Total Amount: {order.totalAmount} {order.currency}</Text>
                <Text style={styles.createdAt}>Created At: {new Date(order.createdAt).toLocaleString()}</Text>
                <OrderStatus status={order.status} />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal style={styles.tabsContainer} showsHorizontalScrollIndicator={false}>
                {['All', 'PENDING_PAYMENT', 'PAID', 'FAILED', 'REFUNDED'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={selectedTab === tab ? styles.activeTabText : styles.tabText}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <ScrollView style={styles.orderList}>
                {renderOrders()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    tabsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 10,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 5,
        height: 40,
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#3F51B5',
    },
    tabText: {
        fontSize: 14,
        color: '#000',
    },
    activeTabText: {
        color: '#FFF',
    },
    orderList: {
        marginTop: -600,
        flex: 1,
    },
    orderCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 14,
        marginTop: 4,
    },
    createdAt: {
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    statusContainer: {
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OrderScreen;
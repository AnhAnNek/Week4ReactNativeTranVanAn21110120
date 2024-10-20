import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import orderService from '../services/orderService'; 

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

const OrderDetail = ({ route }) => {
    const { orderId } = route.params; 
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await orderService.getOrderItemsByOrderId(orderId);
                setOrderDetail(response); 
            } catch (error) {
                console.error('Failed to fetch order details', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!orderDetail || !orderDetail.content) {
        return <Text>No order details available.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Details</Text>
                <View style={styles.orderCard}>
                    <Text style={styles.orderId}>Order ID: {orderId}</Text>
                    <Text style={styles.amount}>Total Amount: {orderDetail.totalElements} items</Text>
                    <Text style={styles.createdAt}>
                        Created At: {new Date(orderDetail.content[0].course.createdAt).toLocaleString()}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                {orderDetail.content.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                        <Text style={styles.itemTextBold}>Course: {item.course.title}</Text>
                        <Text style={styles.itemText}>Price: ${item.price.toFixed(2)}</Text>
                        <Text style={styles.itemTextHighlight}>Discount: {item.discountPercent}%</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 10,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8, 
    },
    amount: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 8, 
    },
    createdAt: {
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
        marginBottom: 12, 
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
    itemCard: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    itemText: {
        fontSize: 14,
        marginBottom: 4, 
    },
    itemTextBold: {
        fontSize: 14,
        fontWeight: 'bold', 
        marginBottom: 4, 
    },
    itemTextHighlight: {
        fontSize: 14,
        color: '#FF9800',
        marginBottom: 4, 
    },
});

export default OrderDetail;

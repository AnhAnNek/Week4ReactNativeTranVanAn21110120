import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CartItem = ({ cartItem, handleRemoveFromCart }) => {
    return (
        <View style={styles.container} key={cartItem.id}>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{cartItem?.course?.title}</Text>
                <Text style={styles.description}>{cartItem?.course?.description}</Text>
                <Text style={styles.teacher}>Teacher: {cartItem?.course?.createdBy}</Text>
            </View>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartItem?.price)}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveFromCart(cartItem?.id)}>
                    <FontAwesome name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor: 'white',
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: 'gray',
    },
    teacher: {
        marginTop: 8,
        fontSize: 14,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        marginRight: 16,
    },
});

export default CartItem;

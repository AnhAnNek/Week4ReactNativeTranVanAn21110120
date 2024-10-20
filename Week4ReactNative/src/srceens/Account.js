import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken, removeToken } from '../utils/authUtils';
import { get, post } from '../utils/httpRequest';

const Account = ({ navigation }) => {
    const userName = "Xuan Hung";

    const handleEditProfile = () => {
        navigation.navigate('Profile');
    };

    const handleHistory = () => {
        // Xử lý sự kiện khi nhấn History
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleLogout = () => {
        removeToken();
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            {/* Avatar và tên */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>XH</Text>
                </View>
                <Text style={styles.userName}>{userName}</Text>
            </View>

            {/* Danh sách các mục */}
            <View style={styles.optionsList}>
                <TouchableOpacity style={styles.optionItem} onPress={handleEditProfile}>
                    <Ionicons name="person-circle-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.optionText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem} onPress={handleHistory}>
                    <Ionicons name="time-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.optionText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem} onPress={handleChangePassword}>
                    <Ionicons name="key-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.optionText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.optionText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    optionsList: {
        width: '100%',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    icon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 18,
    },
});

export default Account;

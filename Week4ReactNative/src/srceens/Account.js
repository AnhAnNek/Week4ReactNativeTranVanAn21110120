import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getToken, removeToken} from '../utils/authUtils';
import authService from '../services/authService';
import {errorToast, successToast} from '../utils/methods';

const Account = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserByToken(); // Fetch notifications again
    setRefreshing(false);
  };

  const fetchUserByToken = async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurUser();
      setUser(userData);
    } catch (error) {
      errorToast('An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserByToken();
  }, []);

  const userName = user?.username;
  const fullName = user?.fullName;

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  const handleHistory = () => {
    navigation.navigate('History Payment');
  };

  const handleChangePassword = () => {
    navigation.navigate('Change Password');
  };

  const handleCart = () => {
    navigation.navigate('Cart');
  };

  const handleFavorites = () => {
    navigation.navigate('Favourite');
  };

  const handleLogout = () => {
    removeToken();
    navigation.navigate('Login');
  };

  const handleHistoryView = () => {
    navigation.navigate('History View');
  };

  const handleCoupon = () => {
    navigation.navigate('Coupon');
  };
  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      {/* Avatar và tên */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {fullName ? fullName.charAt(0).toUpperCase() : ''}
          </Text>
        </View>
        <Text style={styles.userName}>{fullName}</Text>
      </View>

      {/* Danh sách các mục */}
      <View style={styles.optionsList}>
        <TouchableOpacity style={styles.optionItem} onPress={handleEditProfile}>
          <Ionicons
            name="person-circle-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleNotifications}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleCoupon}>
          <Ionicons
            name="pricetag-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Coupon</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleCart}>
          <Ionicons
            name="cart-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleFavorites}>
          <Ionicons
            name="heart-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleHistory}>
          <Ionicons
            name="time-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>History Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleHistoryView}>
          <Ionicons
            name="time-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>History View</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.optionItem}
          onPress={handleChangePassword}>
          <Ionicons
            name="key-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
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

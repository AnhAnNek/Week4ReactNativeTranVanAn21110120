import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Thư viện cho date picker
import DropDownPicker from 'react-native-dropdown-picker'; // Thư viện cho dropdown
import { Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import { API_URL } from '../utils/constants';
import { getToken } from '../utils/authUtils'; // Chỉ giữ lại import getToken
import { get, post } from '../utils/httpRequest';

const Profile = ({ navigation }) => {
    const [user, setUser] = useState({
        username: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        gender: 'MALE',
        otp: '',
    });
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Dropdown state for gender
    const [open, setOpen] = useState(false);
    const [sexOptions, setSexOptions] = useState([
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
        { label: 'Other', value: 'OTHER' },
    ]);

    // Fetch user data based on token
    const fetchUserByToken = async () => {
        setLoading(true);
        try {
            const tokenStr = await getToken();
            const response = await get(`${API_URL}/auth/get-user-by-token`, {
                params: { tokenStr },
            });
            if (response.status === 200) {
                const userData = response.data;
                setUser({
                    username: userData.username,
                    fullName: userData.fullName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    dob: userData.dob,
                    gender: userData.gender,
                    otp: '',
                });
            } else {
                setSnackbarMessage('User not found.');
                setSnackbarVisible(true);
            }
        } catch (error) {
            setSnackbarMessage('Failed to fetch user data.');
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            const response = await post(
                `${API_URL}/auth/generate-otp-to-update-profile/${user.username}`
            );
            if (response.status === 200) {
                const msg = response.data;
                setSnackbarMessage(msg);
                setSnackbarVisible(true);
                navigation.navigate('InputOtpToUpdateProfile', { user });
            } else {
                setSnackbarMessage('Profile update failed.');
                setSnackbarVisible(true);
            }
        } catch (error) {
            setSnackbarMessage(error?.message);
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(user.dob);
        setShowDatePicker(Platform.OS === 'ios');
        setUser({ ...user, dob: currentDate.toISOString().split('T')[0] });
    };

    useEffect(() => {
        fetchUserByToken();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Update Profile</Text>

            {loading ? (
                <ActivityIndicator animating={true} />
            ) : (
                <>
                    {/* Full Name */}
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter full name"
                        value={user.fullName}
                        onChangeText={(text) => setUser({ ...user, fullName: text })}
                    />

                    {/* Email */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        value={user.email}
                        onChangeText={(text) => setUser({ ...user, email: text })}
                        keyboardType="email-address"
                    />

                    {/* Phone Number */}
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        value={user.phoneNumber}
                        onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
                        keyboardType="phone-pad"
                    />

                    {/* Date of Birth */}
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <Text>{user.dob || 'Select Date'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={user.dob ? new Date(user.dob) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    {/* Gender (Dropdown Select) */}
                    <Text style={styles.label}>Gender</Text>
                    <DropDownPicker
                        open={open}
                        value={user.gender}
                        items={sexOptions}
                        setOpen={setOpen}
                        setValue={(callback) => setUser(prevState => ({ ...prevState, gender: callback() }))}
                        setItems={setSexOptions}
                        placeholder="Select gender"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />

                    {/* Save Button */}
                    <TouchableOpacity style={styles.button} onPress={handleProfileUpdate}>
                        <Text style={styles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Snackbar for displaying messages */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    dropdownContainer: {
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Profile;

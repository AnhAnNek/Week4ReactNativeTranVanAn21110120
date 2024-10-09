import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/srceens/Login';
import Register from './src/srceens/Register';
import Home from './src/srceens/Home';
import InputOtpToActiveAccount from './src/srceens/InputOtpToActiveAccount';
import InputOtpToLogin from './src/srceens/InputOtpToLogin';
import InputOtpToUpdateProfile from './src/srceens/InputOtpToUpdateProfile';
import UpdateProfile from './src/srceens/UpdateProfile';
import Course from './src/srceens/Course';
import CourseDetail from './src/srceens/CourseDetail';
import Cart from "./src/srceens/Cart";
import Toast from "react-native-toast-message";
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="InputOtpToActiveAccount" component={InputOtpToActiveAccount} />
        <Stack.Screen name="InputOtpToLogin" component={InputOtpToLogin} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
        <Stack.Screen name="InputOtpToUpdateProfile" component={InputOtpToUpdateProfile} />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen name="CourseDetail" component={CourseDetail} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;

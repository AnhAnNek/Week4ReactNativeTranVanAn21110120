import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/srceens/Login';
import Register from './src/srceens/Register';
import Home from './src/srceens/Home';
import InputOtpToActiveAccount from './src/srceens/InputOtpToActiveAccount';
import InputOtpToLogin from './src/srceens/InputOtpToLogin';
import InputOtpToUpdateProfile from './src/srceens/InputOtpToUpdateProfile';
import Profile from './src/srceens/Profile';
import Course from './src/srceens/Course';
import CourseDetail from './src/srceens/CourseDetail';
import Cart from './src/srceens/Cart';
import Toast from 'react-native-toast-message';
import Orders from './src/srceens/Orders';
import PlayCourse from './src/srceens/PlayCourse';
import MyLearning from './src/srceens/MyLearn';
import ChangePassword from './src/srceens/ResetPassword';
import {LogBox} from 'react-native';
import Favourite from './src/srceens/Favourite';
import History from './src/srceens/History';
import OrderDetail from './src/srceens/OrderDetail';
import PendingPayment from './src/srceens/PendingPayment';
import HistoryView from './src/srceens/HistoryView';
import Coupon from './src/srceens/Coupon';
import MessageDetail from './src/srceens/MessageDetail';
import Notifications from './src/srceens/Notifications';
import ForgotPassword from './src/srceens/ForgotPassword';
import ResetPassword from './src/srceens/ResetPassword';
const Stack = createStackNavigator();
LogBox.ignoreAllLogs();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InputOtpToActiveAccount"
          component={InputOtpToActiveAccount}
        />
        <Stack.Screen name="InputOtpToLogin" component={InputOtpToLogin} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="InputOtpToUpdateProfile"
          component={InputOtpToUpdateProfile}
        />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen name="Course Detail" component={CourseDetail} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Play Course" component={PlayCourse} />
        <Stack.Screen name="My Learning" component={MyLearning} />
        <Stack.Screen name="Change Password" component={ChangePassword} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="History Payment" component={History} />
        <Stack.Screen name="Order Detail" component={OrderDetail} />
        <Stack.Screen name="Pending Payment" component={PendingPayment} />
        <Stack.Screen name="History View" component={HistoryView} />
        <Stack.Screen name="Coupon" component={Coupon} />
        <Stack.Screen name="Message Detail" component={MessageDetail} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Forget Password" component={ForgotPassword} />
        <Stack.Screen name="Reset Password" component={ResetPassword} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '../types';
import {initDatabase} from '../database/db';

// Import Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import CategoryManagement from '../screens/admin/CategoryManagement';
import ProductManagement from '../screens/admin/ProductManagement';
import {Text} from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// --- USER BOTTOM TAB (Tiêu chí A.5) ---
// Gồm: Home, Signup, Login
const UserTabs = ({route}: any) => {
  const user = route.params?.user; // Thông tin user đăng nhập
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{user}} // Truyền user vào Home
        options={{tabBarIcon: () => <Text>🏠</Text>, title: 'Trang chủ'}}
      />
      {/* Các tab Login/Signup giữ lại theo yêu cầu đề bài để chuyển đổi tài khoản */}
      <Tab.Screen
        name="SignupTab"
        component={SignupScreen}
        options={{tabBarIcon: () => <Text>➕</Text>, title: 'Đăng ký'}}
      />
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{tabBarIcon: () => <Text>🔒</Text>, title: 'Đăng nhập'}}
      />
    </Tab.Navigator>
  );
};

// --- ADMIN BOTTOM TAB (Tiêu chí B.4) ---
// Gồm: Home của User, Home của Admin, Signup, Login
const AdminTabs = ({route}: any) => {
  const user = route.params?.user;
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="AdminHome"
        component={AdminDashboard}
        initialParams={{user}}
        options={{tabBarIcon: () => <Text>⚙️</Text>, title: 'Quản trị'}}
      />
      {/* Tab Home của User để Admin xem trước giao diện (Preview) */}
      <Tab.Screen
        name="UserHomePreview"
        component={HomeScreen}
        initialParams={{user}}
        options={{tabBarIcon: () => <Text>👁️</Text>, title: 'Xem Shop'}}
      />
      <Tab.Screen
        name="SignupTab"
        component={SignupScreen}
        options={{tabBarIcon: () => <Text>➕</Text>, title: 'Đăng ký'}}
      />
      <Tab.Screen
        name="LoginTab"
        component={LoginScreen}
        options={{tabBarIcon: () => <Text>🔒</Text>, title: 'Đăng nhập'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  useEffect(() => {
    initDatabase(); // Khởi tạo DB khi chạy App
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Màn hình đầu tiên là Stack Auth để Login */}
        <Stack.Screen name="AuthStack" component={LoginScreen} />

        {/* Sau khi Login -> Điều hướng sang Tab tương ứng */}
        <Stack.Screen name="UserTab" component={UserTabs} />
        <Stack.Screen name="AdminTab" component={AdminTabs} />

        {/* Các màn hình chi tiết (chung cho cả Admin và User nếu cần) */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{headerShown: true, title: 'Chi tiết'}}
        />

        {/* Các màn hình con của Admin (để Navigate từ Dashboard) */}
        <Stack.Screen
          name="UserManagement"
          component={UserManagement}
          options={{headerShown: true, title: 'Quản lý User'}}
        />
        <Stack.Screen
          name="CategoryManagement"
          component={CategoryManagement}
          options={{headerShown: true, title: 'Quản lý Danh mục'}}
        />
        <Stack.Screen
          name="ProductManagement"
          component={ProductManagement}
          options={{headerShown: true, title: 'Quản lý Sản phẩm'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {initDatabase} from '../database/db';
import {Text} from 'react-native';

// User Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/user/HomeScreen';
import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CartScreen from '../screens/user/CartScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import CategoryScreen from '../screens/user/CategoryScreen';
import OrderHistoryScreen from '../screens/user/OrderHistoryScreen';
import ProductsByCategoryScreen from '../screens/user/ProductByCategoryScreen';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import CategoryManagement from '../screens/admin/CategoryManagement';
import ProductManagement from '../screens/admin/ProductManagement';
import OrderManagement from '../screens/admin/OrderManagement';

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator<any>();

// Helper tạo icon cho Tab
const getTabBarIcon = (route: any, color: any, size: any) => {
  let icon = '❓';
  if (route.name === 'Home' || route.name === 'UserHome') icon = '🏠';
  else if (route.name === 'Categories') icon = '📂';
  else if (route.name === 'Cart') icon = '🛒';
  else if (route.name === 'Profile') icon = '👤';
  else if (route.name === 'Login') icon = '🔑';
  else if (route.name === 'Signup') icon = '📝';
  else if (route.name === 'AdminDash') icon = '🛠️';
  return <Text style={{fontSize: size, color}}>{icon}</Text>;
};

// --- 1. GUEST TABS (Tiêu chí A.5: Home, Signup, Login) ---
const GuestTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff5722',
        tabBarIcon: ({color, size}) => getTabBarIcon(route, color, size),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Trang chủ'}}
      />
      <Tab.Screen
        name="Signup"
        component={SignupScreen}
        options={{title: 'Đăng ký'}}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'Đăng nhập'}}
      />
    </Tab.Navigator>
  );
};

// --- 2. USER LOGGED IN TABS (Tiêu chí C.1: Cần Cart, Profile) ---
const UserTabs = ({route}: any) => {
  const user = route.params?.user;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff5722',
        tabBarIcon: ({color, size}) => getTabBarIcon(route, color, size),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{user}}
        options={{title: 'Trang chủ'}}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryScreen}
        initialParams={{user}}
        options={{title: 'Danh mục'}}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        initialParams={{user}}
        options={{title: 'Giỏ hàng'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{user}}
        options={{title: 'Cá nhân'}}
      />
    </Tab.Navigator>
  );
};

// --- 3. ADMIN TABS (Tiêu chí B.4: Home User, Home Admin, Signup, Login) ---
const AdminTabs = ({route}: any) => {
  const user = route.params?.user;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarIcon: ({color, size}) => getTabBarIcon(route, color, size),
      })}>
      {/* Home User: Admin vẫn xem được giao diện người dùng */}
      <Tab.Screen
        name="UserHome"
        component={HomeScreen}
        initialParams={{user}}
        options={{title: 'Web User'}}
      />

      {/* Home Admin: Dashboard quản trị */}
      <Tab.Screen
        name="AdminDash"
        component={AdminDashboard}
        initialParams={{user}}
        options={{title: 'Quản trị'}}
      />

      <Tab.Screen
        name="Signup"
        component={SignupScreen}
        options={{title: 'Đăng ký'}}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'Đăng nhập'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GuestTab"
        screenOptions={{headerShown: false}}>
        {/* 3 Luồng chính */}
        <Stack.Screen name="GuestTab" component={GuestTabs} />
        <Stack.Screen name="UserTab" component={UserTabs} />
        <Stack.Screen name="AdminTab" component={AdminTabs} />

        {/* Màn hình dùng chung (Auth) */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Các màn hình chi tiết (User) */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{headerShown: true, title: 'Chi tiết sản phẩm'}}
        />
        <Stack.Screen
          name="ProductsByCategory"
          component={ProductsByCategoryScreen}
          options={{headerShown: true, title: 'Sản phẩm theo loại'}}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{headerShown: true, title: 'Lịch sử đơn hàng'}}
        />

        {/* Các màn hình quản trị chi tiết (Admin Stack) */}
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
        <Stack.Screen
          name="OrderManagement"
          component={OrderManagement}
          options={{headerShown: true, title: 'Quản lý Đơn hàng'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

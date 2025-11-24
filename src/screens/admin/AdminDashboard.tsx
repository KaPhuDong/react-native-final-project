import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AdminDashboard = ({route}: any) => {
  const user = route.params?.user;
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TRANG QUẢN TRỊ</Text>
        <Text style={{fontSize: 16}}>Xin chào Admin: {user?.username}</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('UserManagement')}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.text}>Quản lý User</Text>
        <Text style={styles.desc}>Xem, xóa, phân quyền người dùng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('CategoryManagement')}>
        <Text style={styles.icon}>📂</Text>
        <Text style={styles.text}>Quản lý Danh mục</Text>
        <Text style={styles.desc}>Thêm loại mới, thêm sản phẩm vào loại</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('ProductManagement')}>
        <Text style={styles.icon}>📦</Text>
        <Text style={styles.text}>Quản lý Sản phẩm</Text>
        <Text style={styles.desc}>Thêm, sửa, xóa giá và ảnh sản phẩm</Text>
      </TouchableOpacity>

      {/* Tiêu chí C.2: Admin quản lý đơn hàng */}
      <TouchableOpacity
        style={[styles.btn, {backgroundColor: '#e3f2fd'}]}
        onPress={() => navigation.navigate('OrderManagement')}>
        <Text style={styles.icon}>🧾</Text>
        <Text style={styles.text}>Quản lý Đơn hàng</Text>
        <Text style={styles.desc}>Xem đơn hàng, duyệt đơn</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5'},
  header: {
    marginBottom: 20,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {fontSize: 24, fontWeight: 'bold', color: '#007bff', marginBottom: 5},
  btn: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  icon: {fontSize: 30, marginBottom: 5},
  text: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  desc: {color: 'gray', textAlign: 'center', marginTop: 5},
});

export default AdminDashboard;

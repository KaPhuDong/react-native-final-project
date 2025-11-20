import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Tiêu chí B.3: Trang chủ quản trị
const AdminDashboard = ({route}: any) => {
  const user = route.params?.user;
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ADMIN DASHBOARD</Text>
        <Text>Chào, {user?.username}</Text>
      </View>

      {/* Các nút chức năng */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('UserManagement')}>
        <Text style={styles.text}>👤 Quản lý User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('CategoryManagement')}>
        <Text style={styles.text}>📂 Quản lý Loại sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('ProductManagement')}>
        <Text style={styles.text}>📦 Quản lý Sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  header: {marginBottom: 30, alignItems: 'center'},
  title: {fontSize: 24, fontWeight: 'bold', color: '#007bff'},
  btn: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  text: {fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
});

export default AdminDashboard;

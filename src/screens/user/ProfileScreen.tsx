import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = ({route}: any) => {
  const user = route.params?.user; // Nhận user từ Tab
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    // Reset về trạng thái khách (reload lại UserTab không có param user)
    navigation.reset({
      index: 0,
      routes: [{name: 'UserTab'}],
    });
  };

  const handleHistory = () => {
    // Navigate tới màn hình lịch sử (Sẽ tạo ở bước sau hoặc dùng Modal)
    navigation.navigate('OrderHistory', {user});
  };

  const handleUpdateInfo = () => {
    Alert.prompt('Đổi mật khẩu', 'Nhập mật khẩu mới:', async text => {
      if (text) {
        // Import updatePassword từ db và gọi nó
        const {updatePassword} = require('../../database/db');
        await updatePassword(user.id, text);
        Alert.alert('Thành công', 'Đã đổi mật khẩu');
      }
    });
  };

  // --- GIAO DIỆN KHÁCH (CHƯA LOGIN) ---
  if (!user) {
    return (
      <View style={styles.containerCenter}>
        <Text style={{fontSize: 18, marginBottom: 20}}>Bạn chưa đăng nhập</Text>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#007bff', width: '80%'}]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.btnText, {color: 'white'}]}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: 'white',
              width: '80%',
              borderWidth: 1,
              borderColor: '#007bff',
              marginTop: 10,
            },
          ]}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.btnText, {color: '#007bff'}]}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- GIAO DIỆN ĐÃ ĐĂNG NHẬP ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/img/anh10.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={{color: 'gray'}}>Role: {user.role}</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#17a2b8'}]}
          onPress={handleHistory}>
          <Text style={[styles.btnText, {color: 'white'}]}>
            📜 Lịch sử mua hàng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#6c757d'}]}
          onPress={handleUpdateInfo}>
          <Text style={[styles.btnText, {color: 'white'}]}>
            🔐 Đổi mật khẩu
          </Text>
        </TouchableOpacity>
        {user.role === 'admin' && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#28a745'}]}
            onPress={() => navigation.navigate('AdminTab', {user})}>
            <Text style={[styles.btnText, {color: 'white'}]}>
              🛠️ Vào trang quản trị
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#dc3545', marginTop: 20}]}
          onPress={handleLogout}>
          <Text style={[styles.btnText, {color: 'white'}]}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {alignItems: 'center', padding: 30, backgroundColor: '#f8f9fa'},
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 10},
  username: {fontSize: 20, fontWeight: 'bold', color: '#333'},
  body: {padding: 20},
  btn: {padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center'},
  btnText: {fontWeight: 'bold', fontSize: 16},
});

export default ProfileScreen;

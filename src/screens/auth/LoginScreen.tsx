import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../../database/db';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password)
      return Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');

    const user = await loginUser(username, password);
    if (user) {
      Alert.alert('Thành công', `Chào mừng ${user.username}`, [
        {
          text: 'OK',
          onPress: () => {
            // Tiêu chí B.2 & A.7: Điều hướng dựa trên Role
            if (user.role === 'admin') {
              // Vào Admin Tab
              navigation.reset({
                index: 0,
                routes: [{name: 'AdminTab', params: {user}}],
              });
            } else {
              // Vào User Tab (Nơi có Cart, Profile)
              navigation.reset({
                index: 0,
                routes: [{name: 'UserTab', params: {user}}],
              });
            }
          },
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập (admin/user)"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu (123)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{color: '#007bff', fontWeight: 'bold'}}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút về Home cho khách */}
      <TouchableOpacity
        onPress={() => navigation.navigate('GuestTab')}
        style={{marginTop: 20}}>
        <Text
          style={{
            textAlign: 'center',
            color: 'gray',
            textDecorationLine: 'underline',
          }}>
          Về Trang chủ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

export default LoginScreen;

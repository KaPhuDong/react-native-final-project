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
import {registerUser} from '../../database/db';

const SignupScreen = () => {
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');
        return;
      }
      await registerUser(username, password);
      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'), // Chuyển sang Login
        },
      ]);
    } catch (e) {
      Alert.alert('Lỗi', 'Tên đăng nhập đã tồn tại');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÝ</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.btn, {backgroundColor: '#28a745'}]}
        onPress={handleSignup}>
        <Text style={styles.btnText}>Đăng ký</Text>
      </TouchableOpacity>

      {/* Nút quay lại đăng nhập */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{marginTop: 15}}>
        <Text style={{color: '#007bff', textAlign: 'center'}}>
          Đã có tài khoản? Quay lại Đăng nhập
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  btn: {padding: 15, alignItems: 'center', borderRadius: 5},
  btnText: {color: 'white', fontWeight: 'bold'},
});

export default SignupScreen;

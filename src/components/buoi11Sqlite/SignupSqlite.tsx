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
import {addUser} from './database';

const SignupSqlite = () => {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin');
      return;
    }

    const success = await addUser(username, password, 'user');

    if (success) {
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        {
          text: 'OK',
          onPress: () => {
            setUsername('');
            setPassword('');
            navigation.navigate('LoginSqlite'); // chuyển đúng tab
          },
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Username đã tồn tại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký (SQLite)</Text>

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

      <TouchableOpacity style={styles.btn} onPress={handleSignup}>
        <Text style={styles.btnText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  title: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
});

export default SignupSqlite;

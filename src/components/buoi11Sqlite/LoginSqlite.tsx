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
import {getUserByCredentials} from './database';

const LoginSqlite = () => {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const user = await getUserByCredentials(username, password);

    if (user) {
      Alert.alert(
        '🎉 Đăng nhập thành công',
        `Xin chào ${user.username}\nRole: ${user.role}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setUsername('');
              setPassword('');
              navigation.navigate('HomeTab'); // Chuyển sang tab Home sau khi bấm OK
            },
          },
        ],
      );
    } else {
      Alert.alert('Sai thông tin', 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập (SQLite)</Text>

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

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Đăng nhập</Text>
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
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {color: '#fff', textAlign: 'center', fontWeight: 'bold'},
});

export default LoginSqlite;

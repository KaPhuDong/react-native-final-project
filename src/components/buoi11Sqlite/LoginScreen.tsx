import React from 'react';
import {View, Text, Button} from 'react-native';

export default function LoginScreen({navigation}: any) {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button
        title="Đi tới đăng ký"
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title="Đăng nhập thành công"
        onPress={() => navigation.replace('MainTabs')} // Thay thế stack hiện tại, vào tab chính
      />
    </View>
  );
}

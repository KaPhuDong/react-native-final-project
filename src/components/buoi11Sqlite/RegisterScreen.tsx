import React from 'react';
import {View, Text, Button} from 'react-native';

export default function RegisterScreen({navigation}: any) {
  return (
    <View>
      <Text>Register Screen</Text>
      <Button title="Quay lại đăng nhập" onPress={() => navigation.goBack()} />
    </View>
  );
}

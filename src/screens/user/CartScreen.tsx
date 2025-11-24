/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {fetchCart, removeFromCart, placeOrder} from '../../database/db';

const CartScreen = ({route, navigation}: any) => {
  const user = route.params?.user;
  const isFocused = useIsFocused();
  const [cartItems, setCartItems] = useState<any[]>([]);

  const loadCart = async () => {
    if (user) {
      const data = await fetchCart(user.id);
      setCartItems(data);
    }
  };

  useEffect(() => {
    if (isFocused) loadCart();
  }, [isFocused, user]); // Thêm user vào dependency

  const handleDelete = async (id: number) => {
    await removeFromCart(id);
    loadCart();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Xác nhận',
      `Thanh toán tổng ${totalPrice.toLocaleString()} đ?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đồng ý',
          onPress: async () => {
            await placeOrder(user.id, cartItems, totalPrice); // Lưu vào DB
            Alert.alert('Thành công', 'Đặt hàng thành công!');
            loadCart(); // Reload để thấy giỏ hàng trống
          },
        },
      ],
    );
  };

  // --- NẾU LÀ KHÁCH ---
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{fontSize: 18, marginBottom: 20}}>
          Vui lòng đăng nhập để xem giỏ hàng
        </Text>
        <TouchableOpacity
          style={[styles.checkoutBtn, {width: 150}]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🛒 Giỏ hàng của {user.username}</Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 50}}>
            Giỏ hàng trống
          </Text>
        }
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image
              source={require('../../assets/img/anh3.jpg')}
              style={styles.img}
            />
            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
              <Text>Số lượng: {item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{fontSize: 20}}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Tổng: {totalPrice.toLocaleString()} đ
          </Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>THANH TOÁN</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 10},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  img: {width: 60, height: 60, marginRight: 10, borderRadius: 5},
  name: {fontWeight: 'bold', fontSize: 16},
  price: {color: 'red'},
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    alignItems: 'center',
  },
  totalText: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  checkoutBtn: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
});

export default CartScreen;

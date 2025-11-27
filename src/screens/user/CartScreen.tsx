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
// Thêm updateCartQuantity vào import
import {
  fetchCart,
  removeFromCart,
  placeOrder,
  updateCartQuantity,
} from '../../database/db';
import {getProductImage} from '../../utils/imageMap';

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
  }, [isFocused, user]);

  const handleDelete = async (id: number) => {
    Alert.alert('Xác nhận', 'Xóa sản phẩm này khỏi giỏ?', [
      {text: 'Hủy'},
      {
        text: 'Xóa',
        onPress: async () => {
          await removeFromCart(id);
          loadCart();
        },
      },
    ]);
  };

  // --- TÍNH NĂNG CẬP NHẬT SỐ LƯỢNG (0.5đ) ---
  const handleQuantityChange = async (item: any, change: number) => {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      handleDelete(item.id);
    } else {
      await updateCartQuantity(item.id, newQty);
      loadCart(); // Load lại để cập nhật giá tổng
    }
  };

  // --- TÍNH NĂNG CHECKOUT & ĐẶT HÀNG (0.5đ) ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Xác nhận thanh toán',
      `Tổng tiền: ${totalPrice.toLocaleString()} đ\nBạn có chắc chắn muốn đặt hàng?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              await placeOrder(user.id, cartItems, totalPrice);
              Alert.alert('Thành công', 'Đơn hàng đã được đặt thành công!');
              loadCart();
            } catch (e) {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng.');
            }
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Vui lòng đăng nhập để xem giỏ hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{color: 'blue', marginTop: 10}}>Đăng nhập ngay</Text>
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
      <Text style={styles.headerTitle}>🛒 Giỏ hàng</Text>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
        }
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image source={getProductImage(item.img)} style={styles.img} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>

              {/* Khu vực cập nhật số lượng */}
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleQuantityChange(item, -1)}>
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleQuantityChange(item, 1)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Tổng cộng: {totalPrice.toLocaleString()} đ
          </Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>THANH TOÁN & ĐẶT HÀNG</Text>
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
  emptyText: {textAlign: 'center', marginTop: 50, fontSize: 16},
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  img: {width: 70, height: 70, marginRight: 10, resizeMode: 'contain'},
  info: {flex: 1},
  name: {fontWeight: 'bold', fontSize: 15},
  price: {color: 'red', marginBottom: 5},
  qtyContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  qtyBtn: {
    backgroundColor: '#eee',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  qtyText: {fontSize: 18, fontWeight: 'bold'},
  qtyNumber: {marginHorizontal: 15, fontSize: 16},
  deleteIcon: {fontSize: 20, padding: 5},
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
    width: '100%',
    alignItems: 'center',
  },
  checkoutText: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

export default CartScreen;

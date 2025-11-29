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
  Modal, // Thêm Import Modal
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
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

  // State cho Modal Thanh Toán Thành Công
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPaidAmount, setLastPaidAmount] = useState(0);

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

  const handleQuantityChange = async (item: any, change: number) => {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      handleDelete(item.id);
    } else {
      await updateCartQuantity(item.id, newQty);
      loadCart();
    }
  };

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
              // Lưu lại tổng tiền trước khi đặt (để hiển thị lên modal)
              const amount = totalPrice;
              await placeOrder(user.id, cartItems, amount);

              // Cập nhật UI
              setLastPaidAmount(amount);
              setShowSuccessModal(true); // Hiện Modal thay vì Alert
              loadCart(); // Giỏ hàng sẽ trống
            } catch (e) {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng.');
            }
          },
        },
      ],
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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

      {/* --- MODAL THÔNG BÁO THÀNH CÔNG (GIỐNG SHOPEE) --- */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconCircle}>
              <Text style={styles.checkIcon}>✔</Text>
            </View>
            <Text style={styles.successTitle}>Thanh toán thành công!</Text>
            <Text style={styles.successAmount}>
              {lastPaidAmount.toLocaleString()} đ
            </Text>

            <View style={styles.modalActions}>
              {/* Nút 1: Tiếp tục mua hàng -> Ở lại Cart (hoặc reload) */}
              <TouchableOpacity
                style={[styles.modalBtn, styles.btnOutline]}
                onPress={() => setShowSuccessModal(false)}>
                <Text style={styles.textOutline}>Tiếp tục mua hàng</Text>
              </TouchableOpacity>

              {/* Nút 2: Quay lại trang chủ -> Về Home */}
              <TouchableOpacity
                style={[styles.modalBtn, styles.btnSolid]}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Home');
                }}>
                <Text style={styles.textSolid}>Quay lại trang chủ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // --- STYLES CHO MODAL THÀNH CÔNG ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkIcon: {color: 'white', fontSize: 30, fontWeight: 'bold'},
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  successAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5722',
    marginBottom: 25,
  },
  modalActions: {width: '100%'},
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  btnOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ff5722',
  },
  btnSolid: {
    backgroundColor: '#ff5722',
  },
  textOutline: {color: '#ff5722', fontWeight: 'bold', fontSize: 16},
  textSolid: {color: 'white', fontWeight: 'bold', fontSize: 16},
});

export default CartScreen;

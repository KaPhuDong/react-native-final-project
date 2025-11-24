import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {addToCart} from '../../database/db';

const ProductDetailScreen = ({route, navigation}: any) => {
  const {product, user} = route.params; // Nhận thêm user từ params

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
        [
          {text: 'Hủy', style: 'cancel'},
          {text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login')},
        ],
      );
      return;
    }

    await addToCart(user.id, product.id);
    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
      {text: 'Tiếp tục xem'},
      {text: 'Đến giỏ hàng', onPress: () => navigation.navigate('Cart')},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hình ảnh minh họa */}
      <Image source={require('../../assets/img/anh3.jpg')} style={styles.img} />

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      <Text style={styles.desc}>Sản phẩm chính hãng chất lượng cao...</Text>

      <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
        <Text style={styles.addText}>🛒 THÊM VÀO GIỎ HÀNG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  img: {width: 250, height: 250, marginBottom: 20, resizeMode: 'contain'},
  name: {fontSize: 26, fontWeight: 'bold', marginBottom: 10},
  price: {fontSize: 22, color: 'red', marginBottom: 15, fontWeight: 'bold'},
  desc: {fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center'},
  addBtn: {
    width: '100%',
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default ProductDetailScreen;

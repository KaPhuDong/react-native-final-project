import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const ProductDetailScreen = ({route}: any) => {
  const {product} = route.params;
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/img/anh3.jpg')} style={styles.img} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      <Text style={styles.desc}>Mô tả chi tiết sản phẩm...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  img: {width: 200, height: 200, marginBottom: 20},
  name: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  price: {fontSize: 20, color: 'red', marginBottom: 10},
  desc: {fontSize: 16, color: '#666'},
});

export default ProductDetailScreen;

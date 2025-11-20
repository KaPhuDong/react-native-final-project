import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {Product, fetchCategories} from './database';
import {Category} from './database';
import CategorySelector from './CategorySelector';
import {RootStackParamList} from './AppNavigatorProduct';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductsByCategory'
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {product} = route.params;

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    load();
  }, []);

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) return {uri: img};
    switch (img) {
      case 'hinh1.jpg':
        return require('../../assets/img/anh1.jpg');
      case 'hinh2.jpg':
        return require('../../assets/img/anh2.jpg');
      default:
        return require('../../assets/img/anh3.jpg');
    }
  };

  const handleSelectCategory = (id: number) => {
    const selected = categories.find(c => c.id === id);
    if (selected) {
      console.log('Selected category:', selected);
      navigation.navigate('ProductsByCategory', {
        categoryId: selected.id,
        categoryName: selected.name, // nếu có
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={getImageSource(product.img)} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>

      <Text style={styles.label}>Xem các sản phẩm khác:</Text>
      <CategorySelector
        categories={categories}
        selectedId={product.categoryId}
        onSelect={handleSelectCategory}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16},
  image: {width: '100%', height: 200, resizeMode: 'contain'},
  name: {fontSize: 22, fontWeight: 'bold', marginVertical: 10},
  price: {fontSize: 18, color: '#444', marginBottom: 10},
  label: {marginTop: 20, fontSize: 16, fontWeight: 'bold'},
});

export default ProductDetailScreen;

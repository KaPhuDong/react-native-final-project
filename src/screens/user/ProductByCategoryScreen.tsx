import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {searchProducts} from '../../database/db';
import {Product} from '../../types';
import {getProductImage} from '../../utils/imageMap';

const ProductsByCategoryScreen = ({route, navigation}: any) => {
  const {categoryId, categoryName, user} = route.params;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      // Gọi hàm searchProducts nhưng chỉ truyền categoryId
      const data = await searchProducts('', categoryId);
      setProducts(data);
    };
    load();
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh mục: {categoryName}</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Chưa có sản phẩm nào
          </Text>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item, user})
            }>
            <Image source={getProductImage(item.img)} style={styles.img} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  img: {width: 100, height: 100, marginBottom: 5},
  name: {fontWeight: 'bold', textAlign: 'center'},
  price: {color: 'red'},
});

export default ProductsByCategoryScreen;

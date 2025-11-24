import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {fetchCategories} from '../../database/db';
import {Category} from '../../types';

const CategoryScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const user = route.params?.user;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadCategories();
    }
  }, [isFocused]);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Mục Sản Phẩm</Text>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              // Chuyển sang màn hình danh sách sản phẩm theo loại (tận dụng file cũ của bạn)
              navigation.navigate('ProductsByCategory', {
                categoryId: item.id,
                categoryName: item.name,
                user: user, // Truyền user theo để nếu họ muốn mua hàng
              })
            }>
            <Text style={styles.icon}>📂</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 15},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  icon: {fontSize: 24, marginRight: 15},
  name: {fontSize: 18, fontWeight: '500', flex: 1, color: '#333'},
  arrow: {fontSize: 24, color: '#999'},
});

export default CategoryScreen;

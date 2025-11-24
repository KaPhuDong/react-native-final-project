/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  fetchCategories,
} from '../../database/db';
import {Product, Category} from '../../types';

const ProductManagement = ({route}: any) => {
  // Nhận initialCategoryId từ CategoryManagement chuyển sang
  const initialCategoryId = route.params?.initialCategoryId || 0;

  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    img: 'anh1.jpg',
    categoryId: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  // Nếu có initialCategoryId, set vào form ngay khi load xong danh mục
  useEffect(() => {
    if (initialCategoryId && cats.length > 0) {
      setForm(prev => ({...prev, categoryId: initialCategoryId}));
    }
  }, [initialCategoryId, cats]);

  const load = async () => {
    setProducts(await fetchProducts());
    const c = await fetchCategories();
    setCats(c);
    // Mặc định chọn category đầu tiên nếu chưa chọn
    if (c.length > 0 && form.categoryId === 0 && !initialCategoryId) {
      setForm(f => ({...f, categoryId: c[0].id}));
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price)
      return Alert.alert('Lỗi', 'Nhập thiếu thông tin');
    const p = {...form, price: parseFloat(form.price), id: editId || 0};
    if (editId) await updateProduct(p);
    else await addProduct(p);

    setForm({name: '', price: '', img: 'anh1.jpg', categoryId: cats[0]?.id});
    setEditId(null);
    load();
    Alert.alert('Thành công', editId ? 'Đã cập nhật' : 'Đã thêm mới');
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.form}>
        <Text style={{fontWeight: 'bold', marginBottom: 10}}>
          THÔNG TIN SẢN PHẨM
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          value={form.name}
          onChangeText={t => setForm({...form, name: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá tiền"
          keyboardType="numeric"
          value={form.price}
          onChangeText={t => setForm({...form, price: t})}
        />

        <Text style={{marginBottom: 5}}>Chọn danh mục:</Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
          {cats.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setForm({...form, categoryId: c.id})}
              style={[
                styles.catBadge,
                form.categoryId === c.id && {
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                },
              ]}>
              <Text
                style={{color: form.categoryId === c.id ? 'white' : 'black'}}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text
            style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
            {editId ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View>
              <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{color: 'red'}}>
                {item.price.toLocaleString()} đ
              </Text>
              <Text style={{fontSize: 12, color: 'gray'}}>
                Danh mục ID: {item.categoryId}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setEditId(item.id);
                  setForm({
                    name: item.name,
                    price: item.price.toString(),
                    img: item.img,
                    categoryId: item.categoryId,
                  });
                }}
                style={{marginRight: 15}}>
                <Text style={{fontSize: 20}}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await deleteProduct(item.id);
                  load();
                }}>
                <Text style={{fontSize: 20}}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  btn: {backgroundColor: '#ff5722', padding: 12, borderRadius: 5},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  catBadge: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ProductManagement;

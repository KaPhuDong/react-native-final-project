import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  fetchCategories,
} from '../../database/db';
import {Product, Category} from '../../types';

// Tiêu chí B.7: Quản trị sản phẩm
const ProductManagement = () => {
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

  const load = async () => {
    setProducts(await fetchProducts());
    const c = await fetchCategories();
    setCats(c);
    if (c.length > 0 && form.categoryId === 0)
      setForm({...form, categoryId: c[0].id});
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    const p = {...form, price: parseFloat(form.price), id: editId || 0};
    if (editId) await updateProduct(p);
    else await addProduct(p);

    setForm({name: '', price: '', img: 'anh1.jpg', categoryId: cats[0]?.id});
    setEditId(null);
    load();
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <TextInput
          style={styles.input}
          placeholder="Tên SP"
          value={form.name}
          onChangeText={t => setForm({...form, name: t})}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá"
          keyboardType="numeric"
          value={form.price}
          onChangeText={t => setForm({...form, price: t})}
        />

        {/* Chọn Category đơn giản */}
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
          {cats.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setForm({...form, categoryId: c.id})}
              style={[
                styles.catBadge,
                form.categoryId === c.id && {backgroundColor: '#007bff'},
              ]}>
              <Text
                style={{color: form.categoryId === c.id ? 'white' : 'black'}}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            {editId ? 'CẬP NHẬT' : 'THÊM MỚI'}
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
              <Text>{item.price.toLocaleString()} đ</Text>
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
                }}>
                <Text style={{marginRight: 15}}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await deleteProduct(item.id);
                  load();
                }}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 5,
  },
  btn: {backgroundColor: 'green', padding: 10, borderRadius: 5},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  catBadge: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
});

export default ProductManagement;

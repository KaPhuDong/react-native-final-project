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
import {useNavigation} from '@react-navigation/native';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../database/db';
import {Category} from '../../types';

const CategoryManagement = () => {
  const navigation = useNavigation<any>();
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setCats(await fetchCategories()); //
  };

  const handleSave = async () => {
    if (!name) return;
    if (editId) await updateCategory(editId, name);
    else await addCategory(name);
    setName('');
    setEditId(null);
    load();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Cảnh báo', 'Xóa loại sẽ xóa cả sản phẩm thuộc loại này?', [
      {text: 'Hủy'},
      {
        text: 'Xóa',
        onPress: async () => {
          await deleteCategory(id);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QUẢN LÝ DANH MỤC</Text>

      {/* Form Thêm/Sửa */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên danh mục..."
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {editId ? 'Lưu' : 'Thêm'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cats}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.itemWrapper}>
            {/* --- SỬA ĐỔI: Bấm vào vùng này để xem sản phẩm của danh mục --- */}
            <TouchableOpacity
              style={styles.infoArea}
              onPress={() =>
                navigation.navigate('ProductManagement', {
                  categoryId: item.id, // Truyền ID để lọc
                  categoryName: item.name, // Truyền tên để hiển thị tiêu đề
                })
              }>
              <Text style={styles.icon}>📂</Text>
              <View>
                <Text style={styles.catName}>{item.name}</Text>
                <Text style={styles.subText}>👉 Xem & Quản lý sản phẩm</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setName(item.name);
                  setEditId(item.id);
                }}
                style={styles.iconBtn}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={[styles.iconBtn, {backgroundColor: '#ffebee'}]}>
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
  container: {flex: 1, padding: 15, backgroundColor: '#f8f9fa'},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  inputContainer: {flexDirection: 'row', marginBottom: 20},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#28a745',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  infoArea: {flex: 1, flexDirection: 'row', alignItems: 'center'}, // Vùng bấm rộng hơn
  icon: {fontSize: 24, marginRight: 15},
  catName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  subText: {fontSize: 12, color: '#007bff', marginTop: 2},
  actions: {flexDirection: 'row'},
  iconBtn: {
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
  },
});

export default CategoryManagement;

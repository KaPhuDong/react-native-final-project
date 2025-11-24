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
    setCats(await fetchCategories());
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
    <View style={{flex: 1, padding: 15}}>
      <Text style={styles.title}>QUẢN LÝ DANH MỤC</Text>
      {/* Form Thêm/Sửa */}
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <TextInput
          style={styles.input}
          placeholder="Tên loại sản phẩm"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Text style={{color: 'white'}}>{editId ? 'Lưu' : 'Thêm'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cats}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {item.name}
              </Text>
              {/* Tiêu chí B.6: Thêm sản phẩm cho loại tương ứng */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductManagement', {
                    initialCategoryId: item.id,
                  })
                }>
                <Text style={{color: 'blue', fontSize: 12, marginTop: 5}}>
                  + Thêm sản phẩm vào loại này
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                style={styles.iconBtn}>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#28a745',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  iconBtn: {
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default CategoryManagement;

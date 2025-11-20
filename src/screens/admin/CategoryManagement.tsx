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
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../database/db';
import {Category} from '../../types';

// Tiêu chí B.6: Quản trị loại sản phẩm
const CategoryManagement = () => {
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
    Alert.alert(
      'Cảnh báo',
      'Xóa loại sẽ xóa cả sản phẩm thuộc loại này. Tiếp tục?',
      [
        {text: 'Hủy'},
        {
          text: 'Xóa',
          onPress: async () => {
            await deleteCategory(id);
            load();
          },
        },
      ],
    );
  };

  return (
    <View style={{flex: 1, padding: 15}}>
      <View style={{flexDirection: 'row', marginBottom: 15}}>
        <TextInput
          style={styles.input}
          placeholder="Tên loại"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
          <Text style={{color: 'white'}}>{editId ? 'Sửa' : 'Thêm'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cats}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setName(item.name);
                  setEditId(item.id);
                }}>
                <Text style={{marginRight: 15}}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: 'green',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CategoryManagement;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {fetchUsers, deleteUser, updateUserRole} from '../../database/db';
import {User} from '../../types';

// Tiêu chí B.5: Quản trị user
const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    setUsers(await fetchUsers());
  };

  const handleDelete = (id: number, username: string) => {
    if (username === 'admin')
      return Alert.alert('Lỗi', 'Không thể xóa Admin gốc');
    Alert.alert('Xóa', 'Xóa user này?', [
      {text: 'Hủy'},
      {
        text: 'Xóa',
        onPress: async () => {
          await deleteUser(id);
          load();
        },
      },
    ]);
  };

  const handleRole = async (
    id: number,
    currentRole: string,
    username: string,
  ) => {
    if (username === 'admin') return;
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(id, newRole);
    load();
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View>
              <Text style={{fontWeight: 'bold'}}>{item.username}</Text>
              <Text>Role: {item.role}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => handleRole(item.id, item.role, item.username)}
                style={[styles.btn, {backgroundColor: '#ffc107'}]}>
                <Text>Đổi Role</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.username)}
                style={[styles.btn, {backgroundColor: '#dc3545'}]}>
                <Text style={{color: 'white'}}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
  },
  btn: {padding: 8, borderRadius: 5, marginLeft: 5},
});

export default UserManagement;

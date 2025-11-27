/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  updatePassword,
  checkPassword,
  updateUserInfo,
  getUserById,
} from '../../database/db';

const ProfileScreen = ({route}: any) => {
  const initialUser = route.params?.user;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // State quản lý user data mới nhất từ DB
  const [currentUser, setCurrentUser] = useState<any>(initialUser);

  // State cho form cập nhật thông tin
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // State cho Modal đổi mật khẩu (giữ nguyên code cũ của bạn)
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Load lại thông tin user mỗi khi vào màn hình
  useEffect(() => {
    if (isFocused && initialUser) {
      refreshUserData();
    }
  }, [isFocused]);

  const refreshUserData = async () => {
    const u = await getUserById(initialUser.id);
    if (u) {
      setCurrentUser(u);
      setFullName(u.fullName || '');
      setPhone(u.phone || '');
    }
  };

  // --- TÍNH NĂNG CẬP NHẬT THÔNG TIN (0.25đ) ---
  const handleUpdateInfo = async () => {
    if (!fullName || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên và số điện thoại');
      return;
    }
    await updateUserInfo(currentUser.id, fullName, phone);
    Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    setIsEditMode(false);
    refreshUserData();
  };

  const handleLogout = () => {
    navigation.reset({index: 0, routes: [{name: 'Login'}]}); // Về Login thay vì UserTab
  };

  const handleChangePassword = async () => {
    // ... (Giữ nguyên logic đổi pass của bạn)
    if (!oldPass || !newPass || !confirmPass)
      return Alert.alert('Lỗi', 'Thiếu thông tin');
    if (newPass !== confirmPass)
      return Alert.alert('Lỗi', 'Mật khẩu không khớp');
    const isCorrect = await checkPassword(currentUser.id, oldPass);
    if (!isCorrect) return Alert.alert('Lỗi', 'Sai mật khẩu cũ');
    await updatePassword(currentUser.id, newPass);
    Alert.alert('Thành công', 'Đổi mật khẩu thành công. Đăng nhập lại.', [
      {text: 'OK', onPress: handleLogout},
    ]);
  };

  if (!currentUser) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/img/anh10.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{currentUser.username}</Text>
        <Text style={styles.role}>({currentUser.role})</Text>
      </View>

      <View style={styles.body}>
        {/* FORM THÔNG TIN CÁ NHÂN */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

          <Text style={styles.label}>Họ và tên:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.inputEdit}
              value={fullName}
              onChangeText={setFullName}
            />
          ) : (
            <Text style={styles.textDisplay}>
              {currentUser.fullName || 'Chưa cập nhật'}
            </Text>
          )}

          <Text style={styles.label}>Số điện thoại:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.inputEdit}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.textDisplay}>
              {currentUser.phone || 'Chưa cập nhật'}
            </Text>
          )}

          {isEditMode ? (
            <View style={styles.rowBtn}>
              <TouchableOpacity
                style={[styles.smallBtn, {backgroundColor: 'gray'}]}
                onPress={() => setIsEditMode(false)}>
                <Text style={{color: 'white'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, {backgroundColor: '#28a745'}]}
                onPress={handleUpdateInfo}>
                <Text style={{color: 'white'}}>Lưu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editIconBtn}
              onPress={() => setIsEditMode(true)}>
              <Text style={{color: '#007bff'}}>✏️ Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CÁC CHỨC NĂNG KHÁC */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate('OrderHistory', {user: currentUser})
          }>
          <Text style={styles.btnText}>📜 Lịch sử mua hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>🔐 Đổi mật khẩu</Text>
        </TouchableOpacity>

        {currentUser.role === 'admin' && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#28a745'}]}
            onPress={() =>
              navigation.navigate('AdminTab', {user: currentUser})
            }>
            <Text style={[styles.btnText, {color: 'white'}]}>
              🛠️ Trang quản trị
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#dc3545', marginTop: 20}]}
          onPress={handleLogout}>
          <Text style={[styles.btnText, {color: 'white'}]}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL ĐỔI PASS (Giữ nguyên cấu trúc của bạn) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mới"
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
            <View style={styles.rowBtn}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: 'gray'}]}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: '#007bff'}]}
                onPress={handleChangePassword}>
                <Text style={{color: 'white'}}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f4f4'},
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatar: {width: 80, height: 80, borderRadius: 40, marginBottom: 5},
  username: {fontSize: 20, fontWeight: 'bold'},
  role: {color: 'gray'},
  body: {padding: 15},
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 5,
  },
  label: {fontSize: 13, color: 'gray', marginTop: 5},
  textDisplay: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  inputEdit: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  editIconBtn: {alignSelf: 'flex-end', marginTop: 10},
  rowBtn: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10},
  smallBtn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },

  btn: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  btnText: {fontSize: 16, fontWeight: '500', color: '#333'},

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ProfileScreen;

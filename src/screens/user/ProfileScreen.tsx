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
// THÊM IMPORT NÀY ĐỂ LẤY ẢNH
import {getProductImage, imageList} from '../../utils/imageMap';

const ProfileScreen = ({route}: any) => {
  const initialUser = route.params?.user;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [currentUser, setCurrentUser] = useState<any>(initialUser);

  // State form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('anh10.png'); // State cho Avatar
  const [isEditMode, setIsEditMode] = useState(false);

  // State Modal Avatar
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);

  // State Modal Password
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

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
      setAvatar(u.avatar || 'avatar.png');
    }
  };

  const handleUpdateInfo = async () => {
    if (!fullName || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên và số điện thoại');
      return;
    }
    // Truyền thêm avatar vào hàm update
    await updateUserInfo(currentUser.id, fullName, phone, avatar);
    Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    setIsEditMode(false);
    refreshUserData();
  };

  const handleLogout = () => {
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  const handleChangePassword = async () => {
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

  // --- MODAL CHỌN AVATAR (GIỐNG ADMIN) ---
  const renderAvatarModal = () => (
    <Modal
      visible={isAvatarModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsAvatarModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn Avatar mới</Text>
          <ScrollView style={{height: 300}}>
            <View style={styles.imageGrid}>
              {imageList.map((imgName, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageChoice}
                  onPress={() => {
                    setAvatar(imgName);
                    setIsAvatarModalVisible(false);
                  }}>
                  <Image
                    source={getProductImage(imgName)}
                    style={styles.modalImg}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.modalBtn,
              {backgroundColor: '#dc3545', marginTop: 10},
            ]}
            onPress={() => setIsAvatarModalVisible(false)}>
            <Text style={{color: 'white'}}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!currentUser) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* --- KHU VỰC HIỂN THỊ AVATAR --- */}
        <TouchableOpacity
          disabled={!isEditMode}
          onPress={() => setIsAvatarModalVisible(true)}
          style={{position: 'relative'}}>
          <Image
            source={getProductImage(avatar)} // Hiển thị theo state avatar
            style={styles.avatar}
          />
          {isEditMode && (
            <View style={styles.cameraIcon}>
              <Text>📷</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.username}>{currentUser.username}</Text>
        <Text style={styles.role}>({currentUser.role})</Text>
      </View>

      <View style={styles.body}>
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
                onPress={() => {
                  setIsEditMode(false);
                  refreshUserData(); // Reset lại nếu hủy
                }}>
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

        {/* CÁC NÚT CHỨC NĂNG KHÁC GIỮ NGUYÊN */}
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

      {/* Render các Modal */}
      {renderAvatarModal()}

      <Modal visible={modalVisible} transparent animationType="slide">
        {/* ... Giữ nguyên nội dung modal đổi pass cũ ... */}
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
  // ... Giữ các style cũ
  container: {flex: 1, backgroundColor: '#f4f4f4'},
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatar: {width: 80, height: 80, borderRadius: 40, marginBottom: 5},
  // Thêm style cho icon camera đè lên ảnh
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 2,
    elevation: 3,
  },
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

  // Styles cho Modal Avatar (Copy từ Admin)
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageChoice: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    padding: 5,
  },
  modalImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalBtn: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
  },
});

export default ProfileScreen;

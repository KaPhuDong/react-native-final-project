import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// Import các hàm từ database
import {updatePassword, checkPassword} from '../../database/db';

const ProfileScreen = ({route}: any) => {
  const user = route.params?.user; // Nhận user từ Tab
  const navigation = useNavigation<any>();

  // State cho Modal đổi mật khẩu
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleLogout = () => {
    // Reset về trạng thái khách
    navigation.reset({
      index: 0,
      routes: [{name: 'UserTab'}],
    });
  };

  const handleHistory = () => {
    navigation.navigate('OrderHistory', {user});
  };

  // --- LOGIC ĐỔI MẬT KHẨU MỚI ---
  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp');
      return;
    }

    // 1. Kiểm tra mật khẩu cũ
    const isCorrect = await checkPassword(user.id, oldPass);
    if (!isCorrect) {
      Alert.alert('Lỗi', 'Mật khẩu cũ không chính xác');
      return;
    }

    // 2. Cập nhật mật khẩu mới
    await updatePassword(user.id, newPass);
    Alert.alert(
      'Thành công',
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
      [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            handleLogout(); // Đăng xuất để user đăng nhập lại bằng pass mới
          },
        },
      ],
    );
  };

  const openChangePassModal = () => {
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setModalVisible(true);
  };

  // --- GIAO DIỆN KHÁCH (CHƯA LOGIN) ---
  if (!user) {
    return (
      <View style={styles.containerCenter}>
        <Text style={{fontSize: 18, marginBottom: 20}}>Bạn chưa đăng nhập</Text>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#007bff', width: '80%'}]}
          onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.btnText, {color: 'white'}]}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: 'white',
              width: '80%',
              borderWidth: 1,
              borderColor: '#007bff',
              marginTop: 10,
            },
          ]}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.btnText, {color: '#007bff'}]}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- GIAO DIỆN ĐÃ ĐĂNG NHẬP ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/img/anh10.png')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={{color: 'gray'}}>Role: {user.role}</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#17a2b8'}]}
          onPress={handleHistory}>
          <Text style={[styles.btnText, {color: 'white'}]}>
            📜 Lịch sử mua hàng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#6c757d'}]}
          onPress={openChangePassModal}>
          <Text style={[styles.btnText, {color: 'white'}]}>
            🔐 Đổi mật khẩu
          </Text>
        </TouchableOpacity>

        {user.role === 'admin' && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#28a745'}]}
            onPress={() => navigation.navigate('AdminTab', {user})}>
            <Text style={[styles.btnText, {color: 'white'}]}>
              🛠️ Vào trang quản trị
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#dc3545', marginTop: 20}]}
          onPress={handleLogout}>
          <Text style={[styles.btnText, {color: 'white'}]}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ĐỔI MẬT KHẨU</Text>

            <Text style={styles.label}>Mật khẩu cũ:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
              placeholder="Nhập mật khẩu hiện tại"
            />

            <Text style={styles.label}>Mật khẩu mới:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
              placeholder="Nhập mật khẩu mới"
            />

            <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
              placeholder="Nhập lại mật khẩu mới"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: '#6c757d'}]}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: '#007bff'}]}
                onPress={handleChangePassword}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {alignItems: 'center', padding: 30, backgroundColor: '#f8f9fa'},
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 10},
  username: {fontSize: 20, fontWeight: 'bold', color: '#333'},
  body: {padding: 20},
  btn: {padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center'},
  btnText: {fontWeight: 'bold', fontSize: 16},

  // Styles cho Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#007bff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default ProfileScreen;

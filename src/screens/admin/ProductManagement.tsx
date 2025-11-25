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
  Image,
  Modal,
  ScrollView,
} from 'react-native';
// --- THÊM searchProducts VÀO IMPORT ---
import {
  fetchProducts,
  searchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  fetchCategories,
} from '../../database/db';
import {Product, Category} from '../../types';
import {getProductImage, imageList} from '../../utils/imageMap';

const ProductManagement = ({route, navigation}: any) => {
  // Nhận tham số từ màn hình CategoryManagement
  const filterCategoryId = route.params?.categoryId || 0;
  const filterCategoryName = route.params?.categoryName || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    img: 'anh1.jpg',
    categoryId: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Load lại dữ liệu khi filter thay đổi
  useEffect(() => {
    loadData();
    // Nếu đang lọc theo danh mục, đặt mặc định Form thêm mới vào danh mục đó
    if (filterCategoryId) {
      setForm(prev => ({...prev, categoryId: filterCategoryId}));
    }
  }, [filterCategoryId]);

  const loadData = async () => {
    const c = await fetchCategories();
    setCats(c);

    // --- LOGIC QUAN TRỌNG: LỌC SẢN PHẨM ---
    if (filterCategoryId) {
      // Nếu có ID danh mục, chỉ lấy sản phẩm của danh mục đó
      const filtered = await searchProducts('', filterCategoryId);
      setProducts(filtered);
    } else {
      // Nếu không, lấy tất cả
      setProducts(await fetchProducts());
      if (c.length > 0 && form.categoryId === 0) {
        setForm(f => ({...f, categoryId: c[0].id}));
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price)
      return Alert.alert('Lỗi', 'Vui lòng nhập tên và giá');

    const p = {...form, price: parseFloat(form.price), id: editId || 0};

    if (editId) {
      await updateProduct(p);
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm');
    } else {
      await addProduct(p);
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới');
    }

    setForm({
      name: '',
      price: '',
      img: 'anh1.jpg',
      // Giữ nguyên category đang lọc khi reset form
      categoryId: filterCategoryId || cats[0]?.id || 0,
    });
    setEditId(null);
    setIsFormVisible(false);
    loadData();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận', 'Xóa sản phẩm này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        onPress: async () => {
          await deleteProduct(id);
          loadData();
        },
      },
    ]);
  };

  // ... (Giữ nguyên handleEdit và renderImageModal như cũ) ...
  const handleEdit = (item: Product) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      price: item.price.toString(),
      img: item.img,
      categoryId: item.categoryId,
    });
    setIsFormVisible(true);
  };

  const renderImageModal = () => (
    <Modal
      visible={isImageModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsImageModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn hình ảnh</Text>
          <ScrollView>
            <View style={styles.imageGrid}>
              {imageList.map((imgName, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageChoice}
                  onPress={() => {
                    setForm({...form, img: imgName});
                    setIsImageModalVisible(false);
                  }}>
                  <Image
                    source={getProductImage(imgName)}
                    style={styles.modalImg}
                  />
                  <Text style={{fontSize: 10}} numberOfLines={1}>
                    {imgName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsImageModalVisible(false)}>
            <Text style={{color: 'white'}}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* HEADER: HIỂN THỊ TRẠNG THÁI LỌC */}
      <View style={styles.headerRow}>
        <View style={{flex: 1}}>
          <Text style={styles.screenTitle}>
            {filterCategoryId
              ? `KHO: ${filterCategoryName.toUpperCase()}`
              : 'TẤT CẢ SẢN PHẨM'}
          </Text>
          {/* Nút quay lại xem tất cả */}
          {filterCategoryId > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.setParams({categoryId: 0, categoryName: ''})
              }>
              <Text style={{color: '#007bff', fontSize: 13, marginTop: 4}}>
                ‹ Xem tất cả sản phẩm
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isFormVisible && (
          <TouchableOpacity
            style={styles.addNewBtn}
            onPress={() => {
              setEditId(null);
              setForm({
                name: '',
                price: '',
                img: 'anh1.jpg',
                categoryId: filterCategoryId || cats[0]?.id || 0,
              });
              setIsFormVisible(true);
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>+ Thêm mới</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FORM NHẬP LIỆU (Giữ nguyên logic hiển thị) */}
      {isFormVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {editId ? 'SỬA SẢN PHẨM' : 'THÊM MỚI'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Tên sản phẩm"
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

          <Text style={styles.label}>Danh mục:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginBottom: 10}}>
            {cats.map(c => (
              <TouchableOpacity
                key={c.id}
                // Nếu đang lọc thì khóa không cho chọn danh mục khác để tránh nhầm
                disabled={!!filterCategoryId}
                onPress={() => setForm({...form, categoryId: c.id})}
                style={[
                  styles.catBadge,
                  form.categoryId === c.id && styles.catBadgeActive,
                  filterCategoryId &&
                    form.categoryId !== c.id && {opacity: 0.3},
                ]}>
                <Text
                  style={{color: form.categoryId === c.id ? 'white' : '#333'}}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Hình ảnh:</Text>
          <View style={styles.imageSelector}>
            <Image
              source={getProductImage(form.img)}
              style={styles.previewImg}
            />
            <TouchableOpacity
              style={styles.selectImgBtn}
              onPress={() => setIsImageModalVisible(true)}>
              <Text style={{color: 'white'}}>📷 Đổi ảnh</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={[
                styles.btn,
                {backgroundColor: '#6c757d', flex: 1, marginRight: 5},
              ]}
              onPress={() => setIsFormVisible(false)}>
              <Text style={{color: 'white', textAlign: 'center'}}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {backgroundColor: '#28a745', flex: 1, marginLeft: 5},
              ]}
              onPress={handleSave}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Lưu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 30, color: 'gray'}}>
            Danh mục này chưa có sản phẩm nào.
          </Text>
        }
        renderItem={({item}) => (
          <View style={styles.itemCard}>
            <Image source={getProductImage(item.img)} style={styles.itemImg} />
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {item.price.toLocaleString()} đ
              </Text>
              <Text style={styles.itemCat}>ID: {item.categoryId}</Text>
            </View>
            <View style={styles.actionIcons}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
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
      {renderImageModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f5f5f5'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  screenTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  addNewBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: {fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#555'},
  catBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  catBadgeActive: {backgroundColor: '#007bff', borderColor: '#007bff'},
  imageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  previewImg: {
    width: 50,
    height: 50,
    borderRadius: 5,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 10,
  },
  selectImgBtn: {backgroundColor: '#17a2b8', padding: 8, borderRadius: 5},
  formActions: {flexDirection: 'row', justifyContent: 'space-between'},
  btn: {padding: 12, borderRadius: 8},
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  itemImg: {width: 50, height: 50, borderRadius: 5, resizeMode: 'contain'},
  itemName: {fontWeight: 'bold', fontSize: 15, color: '#333'},
  itemPrice: {color: '#ff5722', fontWeight: '600'},
  itemCat: {fontSize: 12, color: '#888'},
  actionIcons: {flexDirection: 'column'},
  iconBtn: {
    padding: 8,
    marginBottom: 5,
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
    height: '80%',
    resizeMode: 'contain',
    marginBottom: 5,
  },
  closeBtn: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ProductManagement;

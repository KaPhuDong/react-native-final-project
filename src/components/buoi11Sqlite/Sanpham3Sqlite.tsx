//danh sách sản phẩm hiển thị bằng FlatList
import React, { useEffect, useState } from 'react';
import { Alert,
  View, Text, TextInput, TouchableOpacity,
  Image, ScrollView, StyleSheet, FlatList
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';  // Import file picker
// import { useNavigation } from '@react-navigation/native';
import {
  initDatabase,
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product, Category, searchProductsByNameOrCategory,
} from './database';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigatorProduct';
import { useNavigation } from '@react-navigation/native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sanpham3Sqlite'>;


const Sanpham3Sqlite = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');""
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);  // Thêm state lưu đường dẫn hình ảnh
  const navigation = useNavigation<NavigationProp>();


  useEffect(() => {
    initDatabase(() => {
      loadData(); // chỉ gọi sau khi transaction xong
    });
  }, []);
 
 


  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods.reverse()); // Đảo ngược mảng để hiển thị sản phẩm mới lên đầu
  };


  const handleAddOrUpdate = async () => {
    if (!name || !price) return;


    const productData = {
      name,
      price: parseFloat(price),
      img: imageUri || 'hinh1.jpg',  // Sử dụng hình ảnh từ file picker, nếu có
      categoryId,
    };


    try {
      if (editingId !== null) {
        await updateProduct({ id: editingId, ...productData });
        setEditingId(null);
      } else {
        await addProduct(productData);
      }
      setName('');
      setPrice('');
      setCategoryId(1);
      setImageUri(null);  // Reset hình ảnh sau khi thêm/sửa
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };


  const handleEdit = (id: number) => {
    const p = products.find((x) => x.id === id);
    if (p) {
      setName(p.name);
      setPrice(p.price.toString());
      setCategoryId(p.categoryId);
      setImageUri(p.img);  // Lấy đường dẫn hình ảnh từ sản phẩm
      setEditingId(p.id);
    }
  };


  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            loadData();
          },
        },
      ],
      { cancelable: true }
    );
  };


  // Hàm chọn hình ảnh từ thư viện
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);  // Nếu uri là undefined, thay thế bằng null
      }
    });
  };


  //hàm này để ánh xạ với hình ảnh là uri hoặc ảnh tĩnh từ asset, tránh lỗi khi dùng <Image source.../>
  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) {
      return { uri: img }; // Ảnh từ thư viện
    }
 
    // Ảnh tĩnh từ assets
    switch (img) {
      case 'hinh1.jpg':
        return require('../../assets/img/anh1.jpg');
      case 'hinh2.jpg':
        return require('../../assets/img/anh2.jpg');
      // Thêm các ảnh khác nếu cần
      default:
        return require('../../assets/img/anh3.jpg'); // fallback nếu ảnh không tồn tại
    }
  };


  //hàm tìm kiếm tương đối theo tên sản phẩm hoặc tên loại
  const handleSearch = async (keyword: string) => {
    if (keyword.trim() === '') {
      loadData(); // Hiển thị toàn bộ nếu ô tìm kiếm rỗng
    } else {
      const results = await searchProductsByNameOrCategory(keyword);
      setProducts(results.reverse()); // Hiển thị sản phẩm mới nhất trước
    }
  };//áo
 


  //  hàm renderItem để hiển thị từng sản phẩm
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <Image source={getImageSource(item.img)} style={styles.image} />
        </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item.id)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

 
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      {/* dropdown đổ xuống chọn category */}
      <RNPickerSelect
        onValueChange={(value) => setCategoryId(value)}
        items={categories.map((c) => ({ label: c.name, value: c.id }))}
        value={categoryId}
        style={{
          inputAndroid: styles.input,
          inputIOS: styles.input,
        }}
      />


      {/* Chọn hình ảnh */}
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>{imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
      </TouchableOpacity>


      {imageUri && (
        <Image source={getImageSource(imageUri)} style={styles.selectedImage} />
      )}


      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Tìm theo tên sản phẩm hoặc loại"
        onChangeText={handleSearch}
       />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Không có sản phẩm nào</Text>}
      />


    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    height: 40, borderWidth: 1, borderColor: '#aaa',
    borderRadius: 6, paddingHorizontal: 10, marginBottom: 10,
  },
  button: {
    backgroundColor: '#28a', padding: 10,
    borderRadius: 6, alignItems: 'center', marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row', borderWidth: 1,
    borderColor: '#ccc', borderRadius: 8,
    marginBottom: 12, overflow: 'hidden',
  },
  image: { width: 80, height: 80 },
  selectedImage: { width: 100, height: 100, marginVertical: 10 },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  productName: { fontWeight: 'bold', fontSize: 16 },
  productPrice: { color: '#000' },
  iconRow: { flexDirection: 'row', marginTop: 10 },
  icon: { fontSize: 20, marginRight: 10 },
  imagePicker: {
    backgroundColor: '#918', padding: 10,
    borderRadius: 6, alignItems: 'center', marginBottom: 20,
  },
});


export default Sanpham3Sqlite;




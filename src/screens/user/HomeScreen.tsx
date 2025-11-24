/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {fetchCategories, searchProducts} from '../../database/db';
import {Product, Category, User} from '../../types';

// --- SUB-COMPONENTS ---

// 1. Header hiển thị User (Nằm trong vùng cố định)
const UserHeader = ({user}: {user?: User}) => (
  <View style={styles.headerRow}>
    <View>
      <Text style={styles.welcomeText}>Chào mừng,</Text>
      <Text style={styles.userName}>{user ? user.username : 'Khách'}</Text>
    </View>
    {user && (
      <Image
        source={require('../../assets/img/anh10.png')}
        style={styles.avatar}
      />
    )}
  </View>
);

// 2. Khu vực Tìm kiếm & Lọc (Nằm trong vùng cố định)
const SearchAndFilter = ({
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  selectedCat,
  setSelectedCat,
}: any) => {
  return (
    <View style={styles.filterContainer}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Bộ lọc giá */}
      <View style={styles.priceRow}>
        <Text style={styles.labelPrice}>Giá:</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Thấp nhất"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
        />
        <Text style={styles.priceDash}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Cao nhất"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
        />
      </View>

      {/* Danh sách danh mục */}
      <View style={styles.catContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 10, alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.catBtn, !selectedCat && styles.catActive]}
            onPress={() => setSelectedCat(null)}>
            <Text
              style={[styles.catText, !selectedCat && styles.catTextActive]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          {categories.map((c: Category) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.catBtn, selectedCat === c.id && styles.catActive]}
              onPress={() => setSelectedCat(c.id)}>
              <Text
                style={[
                  styles.catText,
                  selectedCat === c.id && styles.catTextActive,
                ]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---

const HomeScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const user = route.params?.user;

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Effect load data
  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused, search, selectedCat, minPrice, maxPrice]);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    const prods = await searchProducts(
      search,
      selectedCat || undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
    );
    setProducts(prods);
  };

  // Render Banner (ListHeaderComponent)
  const renderHeaderList = () => (
    <View style={styles.bannerContainer}>
      <Image
        source={require('../../assets/img/banner.jpg')}
        style={styles.banner}
      />
      <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- A. FIXED HEADER (Dính trên cùng) --- */}
      <View style={styles.fixedHeader}>
        <UserHeader user={user} />
        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={categories}
          selectedCat={selectedCat}
          setSelectedCat={setSelectedCat}
        />
      </View>

      {/* --- B. SCROLLABLE CONTENT (Danh sách sản phẩm) --- */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeaderList} // Banner nằm ở đây
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper} // Căn đều 2 cột
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item, user: user})
            }>
            {/* Ảnh tràn viền */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/img/anh3.jpg')} // Thay bằng {uri: item.image} nếu có
                style={styles.img}
              />
            </View>

            {/* Thông tin sản phẩm */}
            <View style={styles.infoContainer}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

// --- STYLES ---

const {width} = Dimensions.get('window');
const cardWidth = (width - 30) / 2; // (Màn hình - padding 2 bên - khoảng giữa) / 2

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Màu nền tổng thể sáng nhẹ
  },

  // --- Styles Fixed Header ---
  fixedHeader: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    // Tạo bóng đổ để tách biệt với nội dung cuộn bên dưới
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100, // Đảm bảo luôn nằm trên
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  welcomeText: {fontSize: 12, color: '#888'},
  userName: {fontWeight: 'bold', fontSize: 16, color: '#333'},
  avatar: {width: 36, height: 36, borderRadius: 18},

  filterContainer: {
    paddingHorizontal: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Nền xám nhạt hiện đại
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 8,
  },
  searchIcon: {marginRight: 8, fontSize: 14},
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333',
    paddingVertical: 0, // Fix lỗi text lệch trên Android
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelPrice: {fontSize: 13, fontWeight: '600', marginRight: 8, color: '#555'},
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 13,
    textAlign: 'center',
    height: 32,
    color: '#333',
  },
  priceDash: {marginHorizontal: 8, color: '#999'},

  catContainer: {height: 36}, // Chiều cao cố định cho hàng category
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
  },
  catActive: {
    backgroundColor: '#ff5722',
  },
  catText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  catTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // --- Styles List Content ---
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Căn đều 2 bên
  },
  bannerContainer: {
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },

  // --- Styles Card Product (Tối ưu) ---
  card: {
    width: cardWidth, // Kích thước tính toán
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    // Quan trọng để ảnh bo theo góc card
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    width: '100%',
    height: 150, // Chiều cao ảnh cố định
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Lấp đầy khung ảnh
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 36, // Đảm bảo tên ngắn vẫn chiếm đủ 2 dòng để đều card
  },
  price: {
    color: '#ff5722',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;

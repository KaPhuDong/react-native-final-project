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
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {fetchCategories, searchProducts} from '../../database/db';
import {Product, Category, User} from '../../types';
import {getProductImage} from '../../utils/imageMap';

// --- CONFIG KÍCH THƯỚC CARD ---
const {width} = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12; // Khoảng cách giữa các card
const PADDING_HORIZONTAL = 12; // Lề 2 bên màn hình
// Công thức: (Màn hình - Lề 2 bên - Khoảng cách giữa các cột) / Số cột
const CARD_WIDTH =
  (width - PADDING_HORIZONTAL * 2 - SPACING * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

// ... (Giữ nguyên UserHeader và SearchAndFilter như cũ) ...
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

const HomeScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const user = route.params?.user;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={COLUMN_COUNT}
        ListHeaderComponent={renderHeaderList}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item, user: user})
            }>
            <View style={styles.imageContainer}>
              <Image source={getProductImage(item.img)} style={styles.img} />
            </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // --- Fixed Header ---
  fixedHeader: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100,
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
  filterContainer: {paddingHorizontal: 15},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
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
    paddingVertical: 0,
  },
  priceRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
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
  catContainer: {height: 36},
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
  },
  catActive: {backgroundColor: '#ff5722'},
  catText: {fontSize: 13, color: '#666', fontWeight: '500'},
  catTextActive: {color: '#fff', fontWeight: '700'},

  // --- List ---
  listContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingTop: 15,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  bannerContainer: {marginBottom: 15},
  banner: {
    width: '100%',
    height: 140, // Giảm chiều cao banner chút cho cân đối
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },

  // --- Card Product (ĐÃ CHỈNH SỬA) ---
  card: {
    width: CARD_WIDTH, // Sử dụng kích thước tính toán
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: SPACING, // Khoảng cách dọc
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    width: '100%',
    height: 120, // GIẢM TỪ 150 -> 120 ĐỂ CARD NHỎ GỌN
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Thêm padding trong ảnh để ảnh không sát viền quá
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Đổi sang contain để thấy toàn bộ sp
  },
  infoContainer: {
    padding: 8, // Giảm padding
  },
  name: {
    fontSize: 13, // Giảm font
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
    height: 36, // Cố định chiều cao 2 dòng text
  },
  price: {
    color: '#ff5722',
    fontWeight: 'bold',
    fontSize: 14, // Giảm font giá chút
  },
});

export default HomeScreen;

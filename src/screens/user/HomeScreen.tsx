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
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {fetchCategories, searchProducts} from '../../database/db';
import {Product, Category, User} from '../../types';

// Component Header hiển thị user (Tiêu chí A.8)
const Header = ({user, onLogout}: {user?: User; onLogout: () => void}) => (
  <View style={styles.header}>
    <Text style={styles.userText}>
      Xin chào, {user ? user.username : 'Khách'}
    </Text>
    <TouchableOpacity onPress={onLogout}>
      <Text style={{color: 'red', fontWeight: 'bold'}}>Đăng xuất</Text>
    </TouchableOpacity>
  </View>
);

// Component CategorySelector (Tiêu chí A.3)
const CategorySelector = ({cats, selected, onSelect}: any) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{marginVertical: 10}}>
    <TouchableOpacity
      style={[styles.catBtn, !selected && styles.catActive]}
      onPress={() => onSelect(null)}>
      <Text style={{color: !selected ? '#fff' : '#000'}}>Tất cả</Text>
    </TouchableOpacity>
    {cats.map((c: Category) => (
      <TouchableOpacity
        key={c.id}
        style={[styles.catBtn, selected === c.id && styles.catActive]}
        onPress={() => onSelect(c.id)}>
        <Text style={{color: selected === c.id ? '#fff' : '#000'}}>
          {c.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const HomeScreen = ({route}: any) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const user = route.params?.user; // Lấy user từ params

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (isFocused) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, search, selectedCat, minPrice, maxPrice]); // Tự động load khi filter đổi

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);

    // Logic tìm kiếm + Lọc giá + Lọc danh mục (Tiêu chí A.9, A.10, A.11)
    const prods = await searchProducts(
      search,
      selectedCat || undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
    );
    setProducts(prods);
  };

  const handleLogout = () => navigation.navigate('AuthStack');

  return (
    <View style={styles.container}>
      {/* Header User */}
      <Header user={user} onLogout={handleLogout} />

      {/* Banner (Tiêu chí A.2) */}
      <Image
        source={require('../../assets/img/banner.jpg')}
        style={styles.banner}
      />

      {/* Filter Box */}
      <View style={{padding: 10}}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Tìm tên sản phẩm..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={{flexDirection: 'row', gap: 10}}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="Giá từ"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={[styles.input, {flex: 1}]}
            placeholder="Giá đến"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
      </View>

      {/* Category Selector */}
      <View style={{paddingHorizontal: 10}}>
        <CategorySelector
          cats={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />
      </View>

      {/* Danh sách sản phẩm (Tiêu chí A.1) */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ProductDetail', {product: item})
            } // (Tiêu chí A.4)
          >
            <Image
              source={require('../../assets/img/anh3.jpg')}
              style={styles.img}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#eee',
  },
  userText: {fontWeight: 'bold', fontSize: 16},
  banner: {width: '100%', height: 120, resizeMode: 'cover'},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  catBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 8,
  },
  catActive: {backgroundColor: '#007bff', borderColor: '#007bff'},
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  img: {width: 80, height: 80, marginBottom: 5},
  name: {fontWeight: 'bold'},
  price: {color: 'red'},
});

export default HomeScreen;

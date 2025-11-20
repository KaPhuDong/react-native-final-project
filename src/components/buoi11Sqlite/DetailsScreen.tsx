// DetailsScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from './types';

type DetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Details'>;

const DetailsScreen = ({route}: DetailsScreenProps) => {
  const {product} = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.text}>ID: {product.id}</Text>
      <Text style={styles.text}>Tên: {product.name}</Text>
      <Text style={styles.text}>Giá: {product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default DetailsScreen;

// DetailsScreen.tsx

// import React, {useEffect, useState} from 'react';
// import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from './AppNavigatorProduct';
// import {Category, fetchCategories} from './database';
// import CategorySelector from './CategorySelector';

// type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

// const DetailsScreen = ({route, navigation}: Props) => {
//   const {product} = route.params;

//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     const load = async () => {
//       const cats = await fetchCategories();
//       setCategories(cats);
//     };
//     load();
//   }, []);

//   const handleSelectCategory = (id: number) => {
//     const selected = categories.find(c => c.id === id);
//     if (selected) {
//       navigation.navigate('ProductsByCategory', {
//         categoryId: selected.id,
//         categoryName: selected.name,
//       });
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>

//       <Image source={product.image} style={styles.productImage} />

//       <Text style={styles.text}>ID: {product.id}</Text>
//       <Text style={styles.text}>Tên: {product.name}</Text>
//       <Text style={styles.text}>Giá: {product.price}</Text>

//       <Text style={styles.label}>Xem các sản phẩm khác:</Text>

//       <CategorySelector
//         categories={categories}
//         selectedId={product.categoryId ?? 0} // 👈 tránh crash nếu undefined
//         onSelect={handleSelectCategory}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {padding: 20, backgroundColor: '#fff'},
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   text: {fontSize: 16, marginVertical: 5},
//   productImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   label: {fontSize: 18, fontWeight: 'bold', marginTop: 25},
// });

// export default DetailsScreen;

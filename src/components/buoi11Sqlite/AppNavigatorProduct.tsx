import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Sanpham3Sqlite from './Sanpham3Sqlite';
import ProductDetailScreen from './ProductDetailScreen';
import ProductsByCategoryScreen from './ProductByCategoryScreen';
import {Product} from './database';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import {Product1} from './types';

export type RootStackParamList = {
  Sanpham3Sqlite: undefined;
  ProductDetail: {product: Product};
  Details: {product: Product1};
  Home: undefined;
  ProductsByCategory: {categoryId: number; categoryName?: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigatorProduct() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Sanpham3Sqlite" component={Sanpham3Sqlite} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen
        name="ProductsByCategory"
        component={ProductsByCategoryScreen}
      />
    </Stack.Navigator>
  );
}

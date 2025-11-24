// Định nghĩa các kiểu dữ liệu dùng chung cho toàn bộ dự án

export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
  categoryName?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  username?: string; // Dùng khi join bảng user
}

export type RootStackParamList = {
  AuthStack: undefined;
  UserTab: {user: User} | undefined;
  AdminTab: {user: User};
  ProductDetail: {product: Product; user?: User};
  ProductsByCategory: {categoryId: number; categoryName: string; user?: User};
  OrderHistory: {user: User};

  // Admin screens
  AdminDashboard: {user: User};
  UserManagement: undefined;
  CategoryManagement: undefined;
  ProductManagement: undefined;
  OrderManagement: undefined;
  Login: undefined;
  Signup: undefined;
};

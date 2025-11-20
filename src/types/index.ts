// Định nghĩa các kiểu dữ liệu dùng chung cho toàn bộ dự án

export interface User {
  id: number;
  username: string;
  password: string;
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
  img: string; // Lưu tên file ảnh hoặc URL
  categoryId: number;
  categoryName?: string; // Dùng khi join bảng
}

// Định nghĩa tham số cho Navigation
export type RootStackParamList = {
  AuthStack: undefined;
  UserTab: {user: User};
  AdminTab: {user: User};
  ProductDetail: {product: Product};
  // Các màn hình quản lý con của Admin
  UserManagement: undefined;
  CategoryManagement: undefined;
  ProductManagement: undefined;
};

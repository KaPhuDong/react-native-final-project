import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Category, Product, User} from '../types';

SQLite.enablePromise(true);
let db: SQLiteDatabase | null = null;

// Mở kết nối Database
export const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: 'FinalProject.db',
    location: 'default',
  });
  return db;
};

// Khởi tạo bảng và dữ liệu mẫu (Đáp ứng tiêu chí B.1)
export const initDatabase = async () => {
  const database = await getDb();
  await database.transaction(tx => {
    // 1. Bảng Users
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );
    `);
    // Tạo Admin mặc định (pass: 123)
    tx.executeSql(
      "INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', '123', 'admin')",
    );

    // 2. Bảng Categories
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
    );
    // Dữ liệu mẫu Categories
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'Điện thoại')",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (2, 'Laptop')",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (3, 'Phụ kiện')",
    );

    // 3. Bảng Products
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );
    `);
    // Dữ liệu mẫu Products (Đáp ứng tiêu chí A.1)
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('iPhone 15', 25000000, 'anh1.jpg', 1)",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('MacBook Air', 30000000, 'anh2.jpg', 2)",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('Tai nghe Sony', 2000000, 'anh3.jpg', 3)",
    );
  });
  console.log('✅ Database Initialized & Admin Created');
};

// --- USER AUTH ---
export const loginUser = async (u: string, p: string): Promise<User | null> => {
  const db = await getDb();
  const [res] = await db.executeSql(
    'SELECT * FROM users WHERE username=? AND password=?',
    [u, p],
  );
  return res.rows.length > 0 ? res.rows.item(0) : null;
};

export const registerUser = async (u: string, p: string) => {
  const db = await getDb();
  return db.executeSql(
    "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
    [u, p],
  );
};

// --- ADMIN: QUẢN LÝ USER (Tiêu chí B.5) ---
export const fetchUsers = async (): Promise<User[]> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM users');
  return res.rows.raw();
};

export const updateUserRole = async (id: number, newRole: string) => {
  const db = await getDb();
  return db.executeSql('UPDATE users SET role=? WHERE id=?', [newRole, id]);
};

export const deleteUser = async (id: number) => {
  const db = await getDb();
  return db.executeSql('DELETE FROM users WHERE id=?', [id]);
};

// --- ADMIN: QUẢN LÝ CATEGORY (Tiêu chí B.6) ---
export const fetchCategories = async (): Promise<Category[]> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM categories');
  return res.rows.raw();
};

export const addCategory = async (name: string) => {
  const db = await getDb();
  return db.executeSql('INSERT INTO categories (name) VALUES (?)', [name]);
};

export const updateCategory = async (id: number, name: string) => {
  const db = await getDb();
  return db.executeSql('UPDATE categories SET name=? WHERE id=?', [name, id]);
};

export const deleteCategory = async (id: number) => {
  const db = await getDb();
  // Xóa sản phẩm thuộc category này trước
  await db.executeSql('DELETE FROM products WHERE categoryId=?', [id]);
  return db.executeSql('DELETE FROM categories WHERE id=?', [id]);
};

// --- ADMIN/USER: SẢN PHẨM (Tiêu chí A.9, A.10, A.11, B.7) ---
export const fetchProducts = async (): Promise<Product[]> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM products');
  return res.rows.raw();
};

// Tìm kiếm & Lọc (Tên, Danh mục, Giá)
export const searchProducts = async (
  query: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
): Promise<Product[]> => {
  const db = await getDb();
  let sql = `
    SELECT p.*, c.name as categoryName FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE (p.name LIKE ? OR c.name LIKE ?)
  `;
  const params: any[] = [`%${query}%`, `%${query}%`];

  if (categoryId) {
    sql += ' AND p.categoryId = ?';
    params.push(categoryId);
  }
  if (minPrice !== undefined && !isNaN(minPrice)) {
    sql += ' AND p.price >= ?';
    params.push(minPrice);
  }
  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    sql += ' AND p.price <= ?';
    params.push(maxPrice);
  }

  const [res] = await db.executeSql(sql, params);
  return res.rows.raw();
};

export const addProduct = async (p: any) => {
  const db = await getDb();
  return db.executeSql(
    'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
    [p.name, p.price, p.img, p.categoryId],
  );
};

export const updateProduct = async (p: Product) => {
  const db = await getDb();
  return db.executeSql(
    'UPDATE products SET name=?, price=?, img=?, categoryId=? WHERE id=?',
    [p.name, p.price, p.img, p.categoryId, p.id],
  );
};

export const deleteProduct = async (id: number) => {
  const db = await getDb();
  return db.executeSql('DELETE FROM products WHERE id=?', [id]);
};

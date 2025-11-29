import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Category, Product, User} from '../types';

SQLite.enablePromise(true);
let db: SQLiteDatabase | null = null;

export const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: 'FinalProject.db',
    location: 'default',
  });
  return db;
};

export const initDatabase = async () => {
  const database = await getDb();
  await database.transaction(tx => {
    // --- 1. XÓA BẢNG CŨ ĐỂ CẬP NHẬT SCHEMA MỚI ---
    tx.executeSql('DROP TABLE IF EXISTS order_items');
    tx.executeSql('DROP TABLE IF EXISTS orders');
    tx.executeSql('DROP TABLE IF EXISTS cart');
    tx.executeSql('DROP TABLE IF EXISTS products');
    tx.executeSql('DROP TABLE IF EXISTS categories');
    tx.executeSql('DROP TABLE IF EXISTS users'); // Quan trọng: Xóa bảng cũ thiếu cột avatar

    // --- 2. TẠO BẢNG USERS (Đã thêm cột avatar) ---
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        fullName TEXT,
        phone TEXT,
        avatar TEXT
      );
    `);

    // Tạo Admin và User mẫu (Có thêm trường avatar mặc định)
    tx.executeSql(
      "INSERT INTO users (username, password, role, fullName, phone, avatar) VALUES ('admin', '123', 'admin', 'Administrator', '0909000111', 'anh10.png')",
    );
    tx.executeSql(
      "INSERT INTO users (username, password, role, fullName, phone, avatar) VALUES ('Dong', 'Dong', 'user', 'Ka Phu Dong', '0912345678', 'anh10.png')",
    );

    // --- 3. TẠO BẢNG CATEGORY ---
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
    );
    tx.executeSql("INSERT INTO categories (id, name) VALUES (1, 'Điện thoại')");
    tx.executeSql("INSERT INTO categories (id, name) VALUES (2, 'Laptop')");
    tx.executeSql("INSERT INTO categories (id, name) VALUES (3, 'Phụ kiện')");

    // --- 4. TẠO BẢNG PRODUCTS ---
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

    // Danh sách sản phẩm mẫu
    const sampleProducts = [
      "('iPhone 15', 22990000, 'iphone15.jpg', 1)",
      "('iPhone 16 Pro Max', 34990000, 'iphone16ProMax.jpg', 1)",
      "('iPhone 17', 39990000, 'iphone17.jpg', 1)",
      "('Samsung Galaxy S25', 24990000, 'samsungS25.jpg', 1)",
      "('Samsung Galaxy A17', 6990000, 'samsungA17.jpg', 1)",
      "('Samsung Galaxy A07', 3990000, 'samsungA07.jpg', 1)",
      "('Oppo Find X9', 22990000, 'oppoFindX9.jpg', 1)",
      "('Oppo Reno 14', 11990000, 'oppoReno14.jpg', 1)",
      "('Oppo A6 Pro', 5490000, 'oppoA6Pro.jpg', 1)",
      "('Realme C85', 4290000, 'realmeC85.jpg', 1)",
      "('Vivo V60', 8990000, 'vivoV60.jpg', 1)",
      "('Xiaomi 15T Pro', 14990000, 'xiaomi15TPro.jpg', 1)",
      "('Acer Aspire 7', 12990000, 'acer_latop.jpg', 2)",
      "('Dell Inspiron 15', 16490000, 'dell_laptop.jpg', 2)",
      "('MSI Gaming', 28990000, 'gaming_laptop.jpg', 2)",
    ];

    sampleProducts.forEach(sql => {
      tx.executeSql(
        `INSERT INTO products (name, price, img, categoryId) VALUES ${sql}`,
      );
    });

    // --- 5. TẠO BẢNG CART & ORDER ---
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        totalPrice REAL,
        orderDate TEXT,
        status TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        productName TEXT,
        price REAL,
        quantity INTEGER,
        FOREIGN KEY (orderId) REFERENCES orders(id)
      );
    `);
  });
  console.log('✅ Database Resetted & Seeded with New Schema (Has Avatar)');
};

// --- USER FUNCTIONS ---
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
    "INSERT INTO users (username, password, role, fullName, avatar) VALUES (?, ?, 'user', ?, 'avatar.jpg')",
    [u, p, u],
  );
};

export const fetchUsers = async (): Promise<User[]> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM users');
  return res.rows.raw();
};

export const getUserById = async (id: number): Promise<User | null> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM users WHERE id=?', [id]);
  return res.rows.length > 0 ? res.rows.item(0) : null;
};

// --- HÀM UPDATE USER INFO ĐÃ SỬA ---
export const updateUserInfo = async (
  id: number,
  fullName: string,
  phone: string,
  avatar: string, // Thêm tham số avatar
) => {
  const db = await getDb();
  return db.executeSql(
    'UPDATE users SET fullName=?, phone=?, avatar=? WHERE id=?',
    [fullName, phone, avatar, id], // Thêm giá trị avatar vào mảng tham số
  );
};

export const updateUserRole = async (id: number, newRole: string) => {
  const db = await getDb();
  return db.executeSql('UPDATE users SET role=? WHERE id=?', [newRole, id]);
};
export const deleteUser = async (id: number) => {
  const db = await getDb();
  return db.executeSql('DELETE FROM users WHERE id=?', [id]);
};
export const updatePassword = async (id: number, pass: string) => {
  const db = await getDb();
  return db.executeSql('UPDATE users SET password=? WHERE id=?', [pass, id]);
};
export const checkPassword = async (
  id: number,
  pass: string,
): Promise<boolean> => {
  const db = await getDb();
  const [res] = await db.executeSql(
    'SELECT * FROM users WHERE id=? AND password=?',
    [id, pass],
  );
  return res.rows.length > 0;
};

// --- PRODUCT & CATEGORY (Giữ nguyên) ---
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
  await db.executeSql('DELETE FROM products WHERE categoryId=?', [id]);
  return db.executeSql('DELETE FROM categories WHERE id=?', [id]);
};
export const fetchProducts = async (): Promise<Product[]> => {
  const db = await getDb();
  const [res] = await db.executeSql('SELECT * FROM products');
  return res.rows.raw();
};
export const searchProducts = async (
  query: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
): Promise<Product[]> => {
  const db = await getDb();
  let sql = `SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE (p.name LIKE ? OR c.name LIKE ?)`;
  const params: any[] = [`%${query}%`, `%${query}%`];
  if (categoryId) {
    sql += ' AND p.categoryId = ?';
    params.push(categoryId);
  }
  if (minPrice) {
    sql += ' AND p.price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
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

// --- CART (Giữ nguyên) ---
export const addToCart = async (userId: number, productId: number) => {
  const db = await getDb();
  const [result] = await db.executeSql(
    'SELECT * FROM cart WHERE userId = ? AND productId = ?',
    [userId, productId],
  );
  if (result.rows.length > 0) {
    const currentQty = result.rows.item(0).quantity;
    await db.executeSql(
      'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
      [currentQty + 1, userId, productId],
    );
  } else {
    await db.executeSql(
      'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, 1)',
      [userId, productId],
    );
  }
};
export const fetchCart = async (userId: number) => {
  const db = await getDb();
  const [results] = await db.executeSql(
    `SELECT c.id, c.quantity, p.id as productId, p.name, p.price, p.img FROM cart c JOIN products p ON c.productId = p.id WHERE c.userId = ?`,
    [userId],
  );
  return results.rows.raw();
};
export const updateCartQuantity = async (cartId: number, quantity: number) => {
  const db = await getDb();
  if (quantity <= 0) {
    return db.executeSql('DELETE FROM cart WHERE id = ?', [cartId]);
  }
  return db.executeSql('UPDATE cart SET quantity = ? WHERE id = ?', [
    quantity,
    cartId,
  ]);
};
export const removeFromCart = async (cartId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE id = ?', [cartId]);
};
export const clearCart = async (userId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE userId = ?', [userId]);
};

// --- ORDER LOGIC (Giữ nguyên) ---
export const placeOrder = async (
  userId: number,
  cartItems: any[],
  total: number,
) => {
  const db = await getDb();
  try {
    await db.executeSql('BEGIN TRANSACTION');
    const [res] = await db.executeSql(
      "INSERT INTO orders (userId, totalPrice, orderDate, status) VALUES (?, ?, datetime('now','localtime'), 'pending')",
      [userId, total],
    );
    const orderId = res.insertId;
    for (let item of cartItems) {
      await db.executeSql(
        'INSERT INTO order_items (orderId, productId, productName, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.productId, item.name, item.price, item.quantity],
      );
    }
    await db.executeSql('DELETE FROM cart WHERE userId = ?', [userId]);
    await db.executeSql('COMMIT');
  } catch (error) {
    await db.executeSql('ROLLBACK');
    throw error;
  }
};
export const getOrderHistory = async (userId: number) => {
  const db = await getDb();
  const [res] = await db.executeSql(
    'SELECT * FROM orders WHERE userId = ? ORDER BY id DESC',
    [userId],
  );
  return res.rows.raw();
};
export const getAllOrders = async () => {
  const db = await getDb();
  const [res] = await db.executeSql(
    'SELECT o.*, u.username FROM orders o JOIN users u ON o.userId = u.id ORDER BY o.id DESC',
  );
  return res.rows.raw();
};
export const updateOrderStatus = async (orderId: number, status: string) => {
  const db = await getDb();
  return db.executeSql('UPDATE orders SET status = ? WHERE id = ?', [
    status,
    orderId,
  ]);
};

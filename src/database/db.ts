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
    // ... (Giữ nguyên các bảng users, categories, products, cart cũ của bạn) ...

    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      );
    `);
    tx.executeSql(
      "INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', '123', 'admin')",
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (1, 'Điện thoại')",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (2, 'Laptop')",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO categories (id, name) VALUES (3, 'Phụ kiện')",
    );

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
    // (Giữ nguyên các lệnh INSERT mẫu products của bạn)
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('iPhone 15', 25000000, 'anh1.jpg', 1)",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('MacBook Air', 30000000, 'anh2.jpg', 2)",
    );
    tx.executeSql(
      "INSERT OR IGNORE INTO products (name, price, img, categoryId) VALUES ('Tai nghe Sony', 2000000, 'anh3.jpg', 3)",
    );

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

    // --- MỚI: Bảng Đơn Hàng (Orders) ---
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        totalPrice REAL,
        orderDate TEXT,
        status TEXT, -- 'pending', 'completed', 'cancelled'
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    // --- MỚI: Bảng Chi Tiết Đơn Hàng (OrderItems) ---
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
  console.log('✅ Database & Tables Initialized');
};

// --- USER AUTH & MANAGEMENT ---
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
export const updatePassword = async (id: number, pass: string) => {
  // Mới: Cập nhật thông tin
  const db = await getDb();
  return db.executeSql('UPDATE users SET password=? WHERE id=?', [pass, id]);
};

// --- PRODUCT & CATEGORY ---
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
// --- CART ---
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
export const removeFromCart = async (cartId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE id = ?', [cartId]);
};
export const clearCart = async (userId: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM cart WHERE userId = ?', [userId]);
};

// --- MỚI: CÁC HÀM XỬ LÝ ĐƠN HÀNG (Order Logic) ---
export const placeOrder = async (
  userId: number,
  cartItems: any[],
  total: number,
) => {
  const db = await getDb();

  try {
    // 1. Bắt đầu transaction thủ công
    // Cách này an toàn hơn db.transaction() khi xử lý vòng lặp async
    await db.executeSql('BEGIN TRANSACTION');

    // 2. Tạo đơn hàng vào bảng orders
    const [res] = await db.executeSql(
      "INSERT INTO orders (userId, totalPrice, orderDate, status) VALUES (?, ?, datetime('now','localtime'), 'pending')",
      [userId, total],
    );

    const orderId = res.insertId;

    // 3. Lưu chi tiết từng sản phẩm vào bảng order_items
    for (let item of cartItems) {
      await db.executeSql(
        'INSERT INTO order_items (orderId, productId, productName, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.productId, item.name, item.price, item.quantity],
      );
    }

    // 4. QUAN TRỌNG: Xóa giỏ hàng sau khi đã lưu đơn hàng xong
    await db.executeSql('DELETE FROM cart WHERE userId = ?', [userId]);

    // 5. Chốt transaction (Lưu tất cả thay đổi vào DB)
    await db.executeSql('COMMIT');
    console.log(`✅ Đã tạo đơn hàng ${orderId} và xóa giỏ hàng thành công`);
  } catch (error) {
    console.error('❌ Lỗi thanh toán:', error);
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
  // Cho Admin
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

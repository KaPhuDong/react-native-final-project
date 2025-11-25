// src/utils/imageMap.ts

// Import tất cả ảnh ở đây
const images: {[key: string]: any} = {
  // 1. Ảnh sản phẩm mẫu (Phone)
  'iphone15.jpg': require('../assets/img/iphone15.jpg'),
  'iphone16ProMax.jpg': require('../assets/img/iphone16ProMax.jpg'),
  'iphone17.jpg': require('../assets/img/iphone17.jpg'),
  'samsungS25.jpg': require('../assets/img/samsungS25.jpg'),
  'samsungA17.jpg': require('../assets/img/samsungA17.jpg'),
  'samsungA07.jpg': require('../assets/img/samsungA07.jpg'),
  'oppoFindX9.jpg': require('../assets/img/oppoFindX9.jpg'),
  'oppoReno14.jpg': require('../assets/img/oppoReno14.jpg'),
  'oppoA6Pro.jpg': require('../assets/img/oppoA6Pro.jpg'),
  'realmeC85.jpg': require('../assets/img/realmeC85.jpg'),
  'vivoV60.jpg': require('../assets/img/vivoV60.jpg'),
  'xiaomi15TPro.jpg': require('../assets/img/xiaomi15TPro.jpg'),

  // 2. Ảnh sản phẩm mẫu (Laptop)
  'acer_latop.jpg': require('../assets/img/acer_latop.jpg'),
  'dell_laptop.jpg': require('../assets/img/dell_laptop.jpg'),
  'gaming_laptop.jpg': require('../assets/img/gaming_laptop.jpg'),
  'hp_laptop.jpg': require('../assets/img/hp_laptop.jpg'), // Nếu có
  'lenovo_laptop.jpg': require('../assets/img/lenovo_laptop.jpg'), // Nếu có

  // 3. Ảnh mặc định/test
  'anh1.jpg': require('../assets/img/anh1.jpg'),
  'anh2.jpg': require('../assets/img/anh2.jpg'),
  'anh3.jpg': require('../assets/img/anh3.jpg'),
  'anh10.png': require('../assets/img/anh10.png'),
};

// Hàm lấy ảnh an toàn (trả về ảnh mặc định nếu không tìm thấy tên)
export const getProductImage = (imageName: string) => {
  if (images[imageName]) {
    return images[imageName];
  }
  // Trả về ảnh mặc định nếu tên ảnh trong DB không khớp với file nào
  return require('../assets/img/anh3.jpg');
};

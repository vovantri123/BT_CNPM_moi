require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Product = require('./models/product');

const saltRounds = 10;

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log('>>> Connected to MongoDB'))
  .catch((err) => console.log('>>> MongoDB connection error:', err));

const seedUsers = async () => {
  try {
    // Xóa tất cả users cũ
    await User.deleteMany({});
    console.log('>>> Deleted all existing users');

    // Tạo 15 users mẫu
    const users = [];
    for (let i = 1; i <= 15; i++) {
      const hashedPassword = await bcrypt.hash('12345678', saltRounds);
      users.push({
        name: `User ${i}`,
        email: `user${i}@gmail.com`,
        password: hashedPassword,
        role: i <= 5 ? 'Admin' : 'User',
      });
    }

    // Chèn tất cả users vào database
    const result = await User.insertMany(users);
    console.log(`>>> Successfully created ${result.length} users`);
  } catch (error) {
    console.log('>>> Error seeding users:', error);
    throw error;
  }
};

const seedProducts = async () => {
  try {
    // Xóa tất cả products cũ
    await Product.deleteMany({});
    console.log('>>> Deleted all existing products');

    const sampleProducts = [];
    const categories = [
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'beauty',
      'toys',
      'food',
    ];

    // Tạo 50 sản phẩm mẫu
    for (let i = 1; i <= 50; i++) {
      const category = categories[i % categories.length];
      sampleProducts.push({
        name: `Product ${i} - ${category}`,
        description: `Description for product ${i} in ${category} category. This is a high-quality product with excellent features.`,
        price: Math.floor(Math.random() * 500) + 10, // Giá từ 10-510
        category: category,
        image: `https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg`,
        stock: Math.floor(Math.random() * 100) + 10, // Stock từ 10-110
        views: Math.floor(Math.random() * 1000) + 1, // Views từ 1-1000
        promotion: Math.random() > 0.7, // 30% có khuyến mãi
        isActive: true,
      });
    }

    const result = await Product.insertMany(sampleProducts);
    console.log(`>>> Successfully created ${result.length} products`);
  } catch (error) {
    console.log('>>> Error seeding products:', error);
    throw error;
  }
};

const seedData = async () => {
  try {
    await seedUsers();
    await seedProducts();

    console.log('>>> Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.log('>>> Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

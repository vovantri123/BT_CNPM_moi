require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const saltRounds = 10;

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log('>>> Connected to MongoDB'))
    .catch(err => console.log('>>> MongoDB connection error:', err));

const seedUsers = async () => {
    try {
        // Xóa tất cả users cũ (optional)
        // await User.deleteMany({});
        
        // Tạo 15 users mẫu
        const users = [];
        for (let i = 1; i <= 15; i++) {
            const hashedPassword = await bcrypt.hash('123456', saltRounds);
            users.push({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: hashedPassword,
                role: i <= 5 ? 'Admin' : 'User'
            });
        }
        
        // Chèn tất cả users vào database
        const result = await User.insertMany(users);
        console.log(`>>> Successfully created ${result.length} users`);
        
        process.exit(0);
    } catch (error) {
        console.log('>>> Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();

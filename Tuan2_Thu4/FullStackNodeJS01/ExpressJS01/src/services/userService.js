require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try{
        // check user exists
        const user = await User.findOne({ email});
        if(user){
            console.log(">>> User already exists, please use another email");
            return null;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // save user to db
        let result = await User.create({
            name,
            email, 
            password: hashedPassword,
            role: 'User'
        });
        return result

    } catch(error){
        console.log(">>> Error from createUser: ", error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        // fetch user by email
        const user = await User.findOne({ email });
        if (!user) {
            return {
                EC: 1,
                EM: "User with this email does not exist."
            };
        }

        // compare password
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return {
                EC: 2,
                EM: "Password is incorrect."
            };
        }

        // create access token
        const payload = {
            email: user.email,
            name: user.name,
            role: user.role
        };
        const access_token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        return {
            EC: 0,
            EM: "Login successful.",
            DT: {
                access_token,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        };
    } catch (error) {
        console.log(">>> Error from loginService: ", error);
        return {
            EC: -1,
            EM: "An error occurred during login."
        };
    }
}

const getUserService = async (current = 1, pageSize = 5) => {
    try {
        // Chuyển đổi current và pageSize thành số nguyên
        const currentPage = parseInt(current);
        const limit = parseInt(pageSize);
        
        // Tính toán offset (số bản ghi cần bỏ qua)
        const skip = (currentPage - 1) * limit;
        
        // Lấy dữ liệu với phân trang
        const result = await User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
        
        // Đếm tổng số bản ghi
        const totalItems = await User.countDocuments({});
        const totalPages = Math.ceil(totalItems / limit);
        
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems
            },
            result: result
        };
    } catch (error) {
        console.log(">>> Error from getUserService: ", error);
        return null;
    }
}

module.exports = {
    createUserService,
    loginService,
    getUserService
}



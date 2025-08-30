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

const getUserService = async () => {
    try {
        let result = await User.find({}).select('-password');
        return result;
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



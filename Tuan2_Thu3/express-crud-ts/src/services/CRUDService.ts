import bcrypt from 'bcryptjs';
import db from '../models/index';
import type { User } from '../types/database';

const salt = bcrypt.genSaltSync(10);

interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: string;
    roleId: string;
    id?: string;
}

const createNewUser = async (data: UserData): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });

            resolve('OK create a new user successful');
        } catch (e) {
            reject(e);
        }
    });
};

const hashUserPassword = (password: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

// lấy tất cả findAll CRUD
const getAllUser = (): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true // hiển dữ liệu gốc
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

// lấy findOne CRUD
const getUserInfoById = (userId: string): Promise<User | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            });

            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
};

// hàm put CRUD
const updateUser = (data: UserData): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                // lấy danh sách user
                let allusers = await db.User.findAll();
                resolve(allusers);
            } else {
                resolve([]);
            }
        } catch (e) {
            reject(e);
        }
    });
};

// hàm xóa user
const deleteUserById = (userId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });

            if (user) {
                await user.destroy();
                resolve();
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById
};

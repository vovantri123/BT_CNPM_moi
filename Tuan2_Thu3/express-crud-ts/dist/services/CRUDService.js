"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = __importDefault(require("../models/index"));
const salt = bcryptjs_1.default.genSaltSync(10);
const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await index_1.default.User.create({
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
        }
        catch (e) {
            reject(e);
        }
    });
};
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcryptjs_1.default.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch (e) {
            reject(e);
        }
    });
};
// lấy tất cả findAll CRUD
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await index_1.default.User.findAll({
                raw: true // hiển dữ liệu gốc
            });
            resolve(users);
        }
        catch (e) {
            reject(e);
        }
    });
};
// lấy findOne CRUD
const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (user) {
                resolve(user);
            }
            else {
                resolve(null);
            }
        }
        catch (e) {
            reject(e);
        }
    });
};
// hàm put CRUD
const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // lấy danh sách user
                let allusers = await index_1.default.User.findAll();
                resolve(allusers);
            }
            else {
                resolve([]);
            }
        }
        catch (e) {
            reject(e);
        }
    });
};
// hàm xóa user
const deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
                resolve();
            }
            else {
                resolve();
            }
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.default = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById
};
//# sourceMappingURL=CRUDService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('node_fullstack', 'root', '1234567890', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối CSDL thành công');
    }
    catch (error) {
        console.error('Không thể kết nối CSDL:', error);
    }
};
exports.default = connectDB;
//# sourceMappingURL=configdb.js.map
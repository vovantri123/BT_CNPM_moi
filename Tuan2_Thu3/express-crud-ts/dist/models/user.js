"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Sequelize } = require('sequelize');
const { Model, DataTypes } = Sequelize;
exports.default = (sequelize, dataTypes) => {
    class User extends Model {
        static associate(models) {
            // định nghĩa mối quan hệ
        }
    }
    User.init({
        email: dataTypes.STRING,
        password: dataTypes.STRING,
        firstName: dataTypes.STRING,
        lastName: dataTypes.STRING,
        address: dataTypes.STRING,
        phoneNumber: dataTypes.STRING,
        gender: dataTypes.BOOLEAN,
        image: dataTypes.STRING,
        roleId: dataTypes.STRING,
        positionId: dataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
//# sourceMappingURL=user.js.map
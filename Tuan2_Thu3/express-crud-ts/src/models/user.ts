const { Sequelize } = require('sequelize');
const { Model, DataTypes } = Sequelize;

interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: boolean;
    image?: string;
    roleId: string;
    positionId?: string;
}

export default (sequelize: any, dataTypes: any) => {
    class User extends Model implements UserAttributes {
        public id!: number;
        public email!: string;
        public password!: string;
        public firstName!: string;
        public lastName!: string;
        public address!: string;
        public phoneNumber!: string;
        public gender!: boolean;
        public image?: string;
        public roleId!: string;
        public positionId?: string;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;

        static associate(models: any) {
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

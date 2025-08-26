const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node_fullstack', 'root', '1234567890', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,  
});

const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối CSDL thành công');
    } catch (error) {
        console.error('Không thể kết nối CSDL:', error);
    }
}

export default connectDB;

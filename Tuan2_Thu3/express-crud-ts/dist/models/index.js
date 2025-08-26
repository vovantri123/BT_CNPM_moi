"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { Sequelize } = require('sequelize');
const process_1 = __importDefault(require("process"));
const { DataTypes } = Sequelize;
const basename = path_1.default.basename(__filename);
const env = process_1.default.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process_1.default.env[config.use_env_variable], config);
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs_1.default
    .readdirSync(__dirname)
    .filter(file => {
    return (file.indexOf('.') !== 0 &&
        file !== basename &&
        (file.slice(-3) === '.js' || file.slice(-3) === '.ts') &&
        file.indexOf('.test.js') === -1 &&
        file.indexOf('.test.ts') === -1 &&
        file.indexOf('.d.ts') === -1);
})
    .forEach(file => {
    const model = require(path_1.default.join(__dirname, file)).default(sequelize, DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map
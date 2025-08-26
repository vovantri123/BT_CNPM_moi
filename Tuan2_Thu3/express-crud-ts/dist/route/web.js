"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = __importDefault(require("../controller/homeController"));
const router = express_1.default.Router();
const initWebRoutes = (app) => {
    // Cách 1:
    router.get('/', (req, res) => {
        return res.send('Vo Van Tri');
    });
    // Cách 2: gọi hàm trong controller
    router.get('/home', homeController_1.default.getHomePage); // url cho trang chủ
    router.get('/about', homeController_1.default.getAboutPage); // url cho trang about
    router.get('/crud', homeController_1.default.getCRUD); // url get crud
    router.post('/post-crud', homeController_1.default.postCRUD); // url post crud
    router.get('/get-crud', homeController_1.default.getFindAllCrud); // url lấy findAll
    router.get('/edit-crud', homeController_1.default.getEditCRUD); // url get editcrud
    router.post('/put-crud', homeController_1.default.putCRUD); // url put crud
    router.get('/delete-crud', homeController_1.default.deleteCRUD); // url get delete crud
    app.use("/", router); // url mặc định
};
exports.default = initWebRoutes;
//# sourceMappingURL=web.js.map
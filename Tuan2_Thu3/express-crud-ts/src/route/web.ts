import express, { Application, Router } from "express";
import homeController from "../controller/homeController";

const router: Router = express.Router();

const initWebRoutes = (app: Application): void => {
    // Cách 1:
    router.get('/', (req, res) => {
        return res.send('Vo Van Tri');
    });

    // Cách 2: gọi hàm trong controller
    router.get('/home', homeController.getHomePage); // url cho trang chủ
    router.get('/about', homeController.getAboutPage); // url cho trang about
    router.get('/crud', homeController.getCRUD); // url get crud
    router.post('/post-crud', homeController.postCRUD); // url post crud
    router.get('/get-crud', homeController.getFindAllCrud); // url lấy findAll
    router.get('/edit-crud', homeController.getEditCRUD); // url get editcrud
    router.post('/put-crud', homeController.putCRUD); // url put crud
    router.get('/delete-crud', homeController.deleteCRUD); // url get delete crud

    app.use("/", router); // url mặc định
}

export default initWebRoutes;

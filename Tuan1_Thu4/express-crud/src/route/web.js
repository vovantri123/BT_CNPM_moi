import express from "express"; //goi Express
import homeController from "../controller/homeController"; //goi controller

let router = express. Router(); //khoi tạo Route

let initWebRoutes = (app) => {
    //cách 1:
    router.get('/', (req,res) => {
        return res.send('Vo Van Tri');
    });

    //cách 2: gọi ham trong controller
    router.get('/home', homeController.getHomePage); //url cho trang chủ
    router.get('/about', homeController.getAboutPage); //url cho trang about
    router.get('/crud', homeController.getCRUD); //url get crud
    router.post('/post-crud', homeController.postCRUD); //url post crud
    router.get('/get-crud',homeController.getFindAllCrud) //url lay findAll
    router.get('/edit-crud', homeController.getEditCRUD); //url get editcrud
    router.post('/put-crud', homeController.putCRUD); //url put crud
    router.get('/delete-crud', homeController.deleteCRUD); //url get delete crud

    return app.use("/", router); //url mặc định
}

module.exports = initWebRoutes;
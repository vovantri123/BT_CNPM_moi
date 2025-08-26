"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../models/index"));
const CRUDService_1 = __importDefault(require("../services/CRUDService"));
// hàm getHomePage
const getHomePage = async (req, res) => {
    try {
        let data = await index_1.default.User.findAll(); // lấy dữ liệu từ models/index
        console.log(data);
        res.render('homepage.ejs', {
            data: JSON.stringify(data) // trả dữ liệu data về view
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
};
// hàm getAbout
const getAboutPage = (req, res) => {
    res.render('test/about.ejs');
};
// hàm CRUD
const getCRUD = (req, res) => {
    res.render('users/crud.ejs');
};
// hàm findAll CRUD
const getFindAllCrud = async (req, res) => {
    let data = await CRUDService_1.default.getAllUser();
    console.log(data);
    res.render('users/findAllUser.ejs', {
        datalist: data
    }); // gọi view và truyền dữ liệu ra view
};
// hàm post CRUD
const postCRUD = async (req, res) => {
    let message = await CRUDService_1.default.createNewUser(req.body); // gọi service
    console.log(message);
    res.send('Post crud to server');
};
// hàm lấy dữ liệu để edit
const getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) { // check Id
        let userData = await CRUDService_1.default.getUserInfoById(userId);
        console.log(userData);
        res.render('users/updateUser.ejs', {
            data: userData
        });
    }
    else {
        res.send('không lấy được id');
    }
};
const putCRUD = async (req, res) => {
    let data = req.body;
    let data1 = await CRUDService_1.default.updateUser(data); // update rồi hiển thị lại danh sách
    res.render('users/findAllUser.ejs', {
        datalist: data1
    });
};
// hàm delete CRUD
const deleteCRUD = async (req, res) => {
    let id = req.query.id; // vì trên view ?id=1
    if (id) {
        await CRUDService_1.default.deleteUserById(id);
        res.send('Deleted!');
    }
    else {
        res.send('Not find user');
    }
};
// export ra object
exports.default = {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    getFindAllCrud,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};
//# sourceMappingURL=homeController.js.map
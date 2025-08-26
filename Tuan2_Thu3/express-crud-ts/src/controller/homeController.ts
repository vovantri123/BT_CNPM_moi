import { Request, Response } from 'express';
import db from '../models/index';
import CRUDService from '../services/CRUDService';

// hàm getHomePage
const getHomePage = async (req: Request, res: Response): Promise<void> => {
    try {
        let data = await db.User.findAll(); // lấy dữ liệu từ models/index
        console.log(data);

        res.render('homepage.ejs', {
            data: JSON.stringify(data) // trả dữ liệu data về view
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
};

// hàm getAbout
const getAboutPage = (req: Request, res: Response): void => {
    res.render('test/about.ejs');
};

// hàm CRUD
const getCRUD = (req: Request, res: Response): void => {
    res.render('users/crud.ejs');
};

// hàm findAll CRUD
const getFindAllCrud = async (req: Request, res: Response): Promise<void> => {
    let data = await CRUDService.getAllUser();
    console.log(data);

    res.render('users/findAllUser.ejs', {
        datalist: data
    }); // gọi view và truyền dữ liệu ra view
};

// hàm post CRUD
const postCRUD = async (req: Request, res: Response): Promise<void> => {
    let message = await CRUDService.createNewUser(req.body); // gọi service
    console.log(message);

    res.send('Post crud to server');
};

// hàm lấy dữ liệu để edit
const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
    let userId = req.query.id as string;

    if (userId) { // check Id
        let userData = await CRUDService.getUserInfoById(userId);
        console.log(userData);

        res.render('users/updateUser.ejs', {
            data: userData
        });
    } else {
        res.send('không lấy được id');
    }
};

const putCRUD = async (req: Request, res: Response): Promise<void> => {
    let data = req.body;
    let data1 = await CRUDService.updateUser(data); // update rồi hiển thị lại danh sách

    res.render('users/findAllUser.ejs', {
        datalist: data1
    });
};

// hàm delete CRUD
const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
    let id = req.query.id as string; // vì trên view ?id=1

    if (id) {
        await CRUDService.deleteUserById(id);
        res.send('Deleted!');
    } else {
        res.send('Not find user');
    }
};

// export ra object
export default {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    getFindAllCrud,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};

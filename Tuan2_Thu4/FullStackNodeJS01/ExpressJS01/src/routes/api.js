const express = require('express');
const { createUser, handleLogin, getUser, getAccount}
    = require('../controllers/userController');
const { 
    getProductsByCategory, 
    getCategories
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);   

routerAPI.get('/',(req, res) => {
    return res.status(200).json({
        message: 'Hello from express api'
    });
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/users", getUser);
routerAPI.get("/account", delay, getAccount); 

// Product routes
routerAPI.get("/products", getProductsByCategory);
routerAPI.get("/categories", getCategories);

module.exports = routerAPI; //export default
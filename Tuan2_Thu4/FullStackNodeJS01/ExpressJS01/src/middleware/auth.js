require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = [ "/", "/login", "/register", "/products", "/categories"];
    
    // Lấy pathname từ URL, bỏ qua query parameters
    const url = new URL(req.originalUrl, `http://${req.get('host')}`);
    const pathname = url.pathname;
    
    if(white_lists.find(item => '/v1/api' + item === pathname)){ // So sánh chỉ pathname
        next();
    } else {
        if(req?.headers?.authorization?.split(' ')?.[1]){ // Bearer token
            const token = req.headers.authorization.split(' ')[1];
            //verify token
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    createdBy: "Van Tri"
                }
                console.log(">>> check token: ", decoded);
                next();
            } catch(error){
                return res.status(401).json({
                    message: "Token is invalid or has expired",
                });
            }
        } else {
            return res.status(401).json({
                message: "You are not authenticated",
            });
        }

    }
    
}

module.exports = auth;
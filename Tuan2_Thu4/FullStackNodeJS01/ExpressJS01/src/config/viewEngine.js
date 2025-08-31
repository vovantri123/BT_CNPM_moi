const path = require("path");
const express = require("express");

const configViewEngine = (app) => {
  app.set("views", path.join('./src', 'views')); // cho Express biết thư mục chứa các file view template (ở đây dùng EJS).
  app.set("view engine", "ejs"); // Đặt view engine mặc định là ejs, Sau này khi bạn gọi res.render("home"), Express sẽ tự tìm file home.ejs trong thư mục views.

  
  app.use(express.static(path.join('./src','public'))); // middleware để phục vụ file tĩnh (static files) như CSS, JS, ảnh, fonts...
  // Khi này http://localhost:8080 tương ứng với ./src/public
  // Nghĩa là khi bạn truy cập http://localhost:8080/img/logo.png, Express sẽ tự tìm file ./src/public/img/logo.png để trả về. 
}

module.exports = configViewEngine;
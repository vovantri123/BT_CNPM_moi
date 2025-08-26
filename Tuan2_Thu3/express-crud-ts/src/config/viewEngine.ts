import express, { Application } from "express";

const configViewEngine = (app: Application): void => {
    app.use(express.static("./src/public")); // Thiết lập thư mục tĩnh chứa images, css, ..
    app.set("view engine", "ejs"); // thiết lập viewEngine
    app.set("views", "./src/views"); // thư mục chứa views
}

export default configViewEngine;

const express = require('express');
const app = express();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const orderController = require('../app/http/controllers/customers/orderController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
 

// Define the routes using the provided `app` instance
function initRoutes(app) {
    app.get("/", homeController().index);

    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin);

    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);
    app.post("/logout", authController().logout);

    app.get("/cart", auth, cartController().index);
    app.post("/update-cart", auth, cartController().update);

    // Customer routes
    app.post("/orders", auth, orderController().store);
    app.get("/customer/orders", auth, orderController().index);
    app.get("/customers/orders/:id", auth, orderController().show);

    // Admin routes
    app.get("/admin/order", auth, AdminOrderController().index); 

    app.post("/admin/order/status", auth, statusController().update); 

    // Add other routes as needed
}

module.exports = initRoutes;

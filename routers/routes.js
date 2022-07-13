module.exports = (app) => {
  const customers = require("../controllers/controller");
  const login = require("../controllers/login");
  const partner = require("../controllers/partners");
  const account = require("../controllers/account");
  const notifications = require("../controllers/notifications");
  const password = require("../controllers/password");
  const posterity = require("../controllers/posterity");
  const updateUserInfo = require("../controllers/updateUserInfo");
  const userFunc = require("../controllers/userFunction");
  const orders = require("../controllers/orders");
  const auth = require("../middleware/auth");
  const rateLimit = require("express-rate-limit");
  require("dotenv").config();
  const sql = require("../model/db");
  //short link
  var mysql = require("mysql");
  const dbConfig = require("../config/db.config");

  async function db() {
    const connection = mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
    });

    connection.connect(async function (err) {
      if (err) throw err;
      await connection.query(
        "Select * from partners",
        function (err, result, fields) {
          renderAPI(result);
        }
      );
    });
  }
  db();
  function renderAPI(arr) {
    for (let i = 0; i < arr.length; i++) {
      app.get(
        "/redirect/" + arr[i].parent_id + "/user:id",
        rateLimit({
          windowMs: 60 * 120 * 1000,
          max: 1,
          message: "Trùng IP ! Thử lại sau 2h",
        }),
        (req, res) => {
          var replaceWith = "user" + req.params.id;
          var result = arr[i].link.replace(/user001/g, replaceWith);
          res.redirect(result);
        }
      );
    }
  }

  //account
  app.get("/accountkey", auth, account.getAllAccout);

  app.get("/delete/accountkey", auth, account.deleteAccount);
  
  app.post("/add/accountkey", auth, account.addAccount);
  //login
  app.post("/login", login.create);

  app.get("/permission/:userId", auth, userFunc.permission);

  app.get("/userid", auth, userFunc.getId);

  app.get("/listuser", auth, userFunc.getAllUser);

  app.delete("/delete/user/:userId", auth, userFunc.deleteUser);

  app.post("/password/:userId", auth, password.getPassword);

  app.post("/update/password/:userId/:password", auth, password.updatePassword);

  app.post("/customers", customers.create);

  //order

  app.get("/order/user", auth, orders.getOrder);

  app.get("/order/merchant", auth, orders.getOrderMechart);

  app.get("/order/group", auth, orders.getOrderGroup);
  
  app.get("/order/all-merchant", auth, orders.getOrderAllGroupMerchant);

  app.get("/order/export", auth, orders.getDataOrderExport);

  app.get("/order/all-group", auth, orders.getOrderAllGroupStatus);

  app.get("/income/user", auth, orders.getIncome);

  app.get("/income/time/user", auth, orders.getIncomeTime);

  app.get("/status/order" , auth , orders.getStatusMerchant)

  app.get("/status/all-order" , auth , orders.getAllStatusMerchant)
  
  app.get("/rank/user", auth, orders.getRankIncome);

  app.get("/rank/time/user", auth, orders.getRankIncomeTime);
  //partner

  app.get("/partner", auth, partner.getPartners);

  app.post("/update/partner", auth, partner.updatePartner);

  app.post("/add/partner", auth, partner.addPartner);

  // notification
  app.post("/add/notifications", auth, notifications.add);

  app.get("/get/notifications", auth, notifications.get);

  app.get("/getlastest/notifications", auth, notifications.getLastUpdate);

  app.delete("/delete/notifications", auth, notifications.delete);

  app.delete("/delete/partner", auth, partner.deletePartner);

  app.get("/posterity", auth, posterity.getPosterity);

  // Retrieve all Customers
  app.get("/customers", auth, customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", auth, customers.findOne);

  // Update a Customer with customerId
  app.post("/update/info/customers/:customerId", auth, updateUserInfo.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", auth, customers.delete);

  // Create a new Customer
  app.delete("/customers", auth, customers.deleteAll);
};

const sql = require("../model/db");

exports.getOrder = async (req, res) => {
  await sql.query(
    `SELECT * FROM orders WHERE utm_source = "${req.query.idUser}" and sales_time >= "${req.query.since}" and sales_time < "${req.query.until}"`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};
exports.getOrderMechart = async (req, res) => {
  await sql.query(
    `SELECT * FROM orders WHERE utm_source = "${req.query.idUser}" and sales_time >= "${req.query.since}" and sales_time < "${req.query.until}" and merchant = "${req.query.merchant}" ORDER BY sales_time DESC;`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};
exports.getOrderGroup = async (req, res) => {
  await sql.query(
    `SELECT COUNT(order_id) , merchant , utm_source FROM orders WHERE sales_time >= "${req.query.since}" AND sales_time < "${req.query.until}"  AND utm_source = "${req.query.idUser}" GROUP BY merchant;`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
};

exports.getOrderAllGroupMerchant = async (req, res) => {
  await sql.query(
    `SELECT merchant FROM orders WHERE sales_time >= "${req.query.since}" AND sales_time <= "${req.query.until}" GROUP BY merchant`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
};


exports.getOrderAllGroupStatus = async (req, res) => {
  await sql.query(
    `SELECT COUNT(order_id) , SUM(reality_commission) FROM orders WHERE sales_time >= "${req.query.since}" AND sales_time < "${req.query.until}" AND order_status = "${req.query.order_status}" AND merchant = "${req.query.order_merchant}"`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
};

exports.getAllStatusMerchant = async (req, res) => {
  await sql.query(
    `SELECT COUNT(order_id) ,  SUM(reality_commission)  FROM orders
    WHERE sales_time > "${req.query.since}" AND sales_time < "${req.query.until}"  
    AND order_status = "${req.query.status}" AND merchant = "${req.query.merchant}";`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
};


exports.getStatusMerchant = async (req, res) => {
  await sql.query(
    `SELECT COUNT(order_id) ,  SUM(reality_commission)  FROM orders
    WHERE sales_time > "${req.query.since}" AND sales_time < "${req.query.until}"  
    AND utm_source = "${req.query.user_id}" AND order_status = "${req.query.status}" AND merchant = "${req.query.merchant}";`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
};

exports.getIncome = async (req, res) => {
  await sql.query(
    `SELECT SUM(pub_commission) , SUM(reality_commission) FROM orders WHERE utm_source = "${req.query.idUser}" and sales_time >= "${req.query.since}" and sales_time <= "${req.query.until}" and order_status = "1"`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

exports.getIncomeTime = async (req, res) => {
  await sql.query(
    `SELECT SUM(pub_commission) , SUM(reality_commission) FROM orders WHERE utm_source = "${req.query.userId}" and sales_time >= "${req.query.since}" and sales_time < "${req.query.until}" and order_status = "1"`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

exports.getRankIncome = async (req, res) => {
  await sql.query(
    `SELECT utm_source, SUM(pub_commission) , SUM(reality_commission) FROM orders WHERE sales_time >= "${req.query.since}" and sales_time <= "${req.query.until}" and order_status = "1" GROUP BY utm_source ORDER BY SUM(reality_commission) DESC`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

exports.getRankIncomeTime = async (req, res) => {
  await sql.query(
    `SELECT utm_source, SUM(pub_commission) , SUM(reality_commission) FROM orders WHERE sales_time >= "${req.query.since}"  AND sales_time < "${req.query.until}" and order_status = "1" GROUP BY utm_source ORDER BY SUM(reality_commission) DESC`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};


exports.getDataOrderExport = async (req, res) => {
  await sql.query(
    `SELECT * FROM orders WHERE sales_time >= "${req.query.since}"  AND sales_time < "${req.query.until}" ORDER BY utm_source ASC;`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

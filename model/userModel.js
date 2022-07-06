const sql = require("./db.js");
var md5 = require('md5');


// constructor
const Customer = function (customer) {
  this.username = customer.username,
    this.password = md5(customer.password),
    this.name = customer.name,
    this.birthday = customer.birthday,
    this.sex = customer.sex,
    this.sub_district = customer.sub_district,
    this.district = customer.district,
    this.city = customer.city,
    this.bank_account_name = customer.bank_account_name,
    this.bank_account_number = customer.bank_account_number,
    this.bank_name = customer.bank_name,
    this.parent_id = customer.parent_id,
    this.role = 1
};
Customer.create = (newCustomer, result) => {
  sql.query("INSERT INTO users SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newCustomer });
  });
};


Customer.findById = (customerId, result) => {

  sql.query(`SELECT * FROM users WHERE user_id = ${customerId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Customer.getAll = result => {
  sql.query("SELECT * FROM User", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Customer.updateById = (id, customer, result) => {
  sql.query(
    `UPDATE users SET  name = ?, birthday = ?  , sex = ? , bank_account_name = ? , bank_account_number = ? , bank_name = ?  WHERE user_id = ?`,
    [customer.name, customer.birthday, customer.sex, customer.bank_account_name, customer.bank_account_number, customer.bank_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...customer });
    }
  );
};

Customer.remove = (id, result) => {
  sql.query("DELETE FROM User WHERE idUser = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Customer.removeAll = result => {
  sql.query("DELETE FROM User", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = Customer;
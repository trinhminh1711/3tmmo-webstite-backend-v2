const sql = require("../model/db");
exports.getAllAccout = async (req, res) => {
  await sql.query(`SELECT * FROM accounts;`, function (error, results, fields) {
    if (error)
      res.send({
        check: false,
        message: error,
      });
    else {
      res.send(results);
    }
  });
};

exports.addAccount = async (req, res) => {
  await sql.query(
    `INSERT INTO accounts(API_key, username) VALUES ("${req.body.params.APIkey}","${req.body.params.username}")`,
    function (error, results, fields) {
      if (error)
        res.send({
          check: false,
          message: error,
        });
      else {
        res.send(true);
      }
    }
  );
};

exports.deleteAccount = async (req, res) => {
  await sql.query(
    `DELETE FROM accounts WHERE ID='${req.query.account_id}';`,
    function (error, results, fields) {
      if (error)
        res.send({
          check: false,
          message: error,
        });
      else {
        res.send(results);
      }
    }
  );
};

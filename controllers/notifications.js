const sql = require("../model/db");
exports.add = async (req, res) => {
  await sql.query(
    `INSERT INTO notifications ( content, extra_date) VALUES ("'${req.body.data.content}'", "'${req.body.data.extra_date}'");`,
    function (error, results, fields) {
      if (error)
        res.send({
          add: false,
          message: error,
        });
      else {
        res.send({
          add: true,
          data: results,
        });
      }
    }
  );
};
exports.get = async (req, res) => {
  await sql.query(
    `SELECT * FROM notifications`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

exports.getLastUpdate = async (req, res) => {
  await sql.query(
    `SELECT * FROM notifications ORDER BY id DESC LIMIT 1;`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

exports.delete = async (req, res) => {
  await sql.query(
    `DELETE FROM notifications WHERE id="${req.body.id}";`,
    function (error, results, fields) {
      if (error)
        res.send({
          delete: false,
          message: error,
        });
      else {
        res.send({
          delete: true,
          data: results,
        });
      }
    }
  );
};

const sql = require("../model/db");
exports.getPosterity = async (req, res) => {
  await sql.query(
    `SELECT name , username , user_id FROM users WHERE parent_id = "${req.query.id}"`,
    function (error, results, fields) {
      if (error) res.send(error);
      else {
        res.send(results);
      }
    }
  );
};

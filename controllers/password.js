const sql = require("../model/db");
var md5 = require('md5');
require('dotenv').config()
exports.getPassword = async (req, res) => {
    const user_id = req.params.userId;
    await sql.query(`SELECT password FROM users WHERE user_id= ${user_id}`, function (error, results, fields) {
        if (error) res.send(error);
        else {
            res.send(results);
        }
    });

}
exports.updatePassword = async (req, res) => {
    const user_id = req.params.userId;
    const password = req.params.password;
    await sql.query(`UPDATE users SET password = "${password}" WHERE user_id = ${user_id}`, function (error, results, fields) {
        if (error) res.send(error);
        else {
            res.send(results);
        }
    });

}
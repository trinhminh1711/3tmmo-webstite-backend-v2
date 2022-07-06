const sql = require("../model/db");
var md5 = require('md5');
var jwt = require('jsonwebtoken');
require('dotenv').config()
exports.update = async (req, res) => {
    await sql.query(`UPDATE users SET name = "${req.body.data.name}" , birthday = "${req.body.data.birthday}" , sex = "${req.body.data.sex}" ,bank_account_name = "${req.body.data.bank_account_name}" ,bank_account_number = "${req.body.data.bank_account_number}" ,bank_name = "${req.body.data.bank_name}" WHERE user_id = ${req.params.customerId}`, function (error, results, fields) {
        if (error) res.send(
            {
                update: false,
            }
        );
        else {
            res.send(
                {
                    update: true,
                }
            );
        }
    });
}
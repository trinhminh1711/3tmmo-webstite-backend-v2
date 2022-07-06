const sql = require("../model/db");
var md5 = require('md5');
var jwt = require('jsonwebtoken');
require('dotenv').config()
exports.permission = async (req, res) => {
    await sql.query(`SELECT role FROM users WHERE user_id = ${req.params.userId};`, function (error, results, fields) {
        if (error) res.send({
            check: false,
            message: error
        });
        else {
            res.send(
                {
                    check: true,
                    role: results
                }
            );
        }
    });
}

exports.getId = async (req, res) => {
    await sql.query(`SELECT user_id FROM users;`, function (error, results, fields) {
        if (error) res.send({
            check: false,
            message: error
        });
        else {
            res.send(
                results
            );
        }
    });
}

exports.getAllUser = async (req, res) => {
    await sql.query(`SELECT * FROM users;`, function (error, results, fields) {
        if (error) res.send({
            check: false,
            message: error
        });
        else {
            res.send(
                results
            );
        }
    });
}


exports.deleteUser = async (req, res) => {
    await sql.query(`DELETE FROM users WHERE user_id=${req.params.userId};`, function (error, results, fields) {
        if (error) res.send({
            delete: false,
            message: error
        });
        else {
            res.send(
            {
                delete: true,
                message: error
            }
            );
        }
    });
}
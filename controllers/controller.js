const Customer = require("../model/userModel");
require('dotenv').config();
// Create and Save a new Customer
exports.create = (req, res) => {

  if (!req.body.data) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const customer = new Customer({
    username: req.body.data.userName,
    password: req.body.data.passWord,
    name: req.body.data.name,
    birthday: req.body.data.birthday,
    sex: req.body.data.sex,
    sub_district: req.body.data.sub_district,
    district: req.body.data.district,
    city: req.body.data.city,
    bank_account_name: req.body.data.bank_account_name,
    bank_account_number: req.body.data.bank_account_number,
    bank_name: req.body.data.bank_name,
    parent_id: req.body.data.id_parent,
  });

  // Save Customer in the database
  Customer.create(customer, (err, data) => {
    if (err) {
      res.send(false);
    }
    else res.send(true);
  });
};


// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  Customer.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  Customer.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  Customer.updateById(
    req.params.customerId,
    new Customer({
      name: req.body.data.name,
      birthday: req.body.data.birthday,
      sex: req.body.data.sex,
      bank_account_name: req.body.data.bank_account_name,
      bank_account_number: req.body.data.bank_account_number,
      bank_name: req.body.data.bank_name,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  Customer.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.customerId
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    else res.send({ message: `All Customers were deleted successfully!` });
  });
};
const db = require("../models");
const Customer = db.customers;
const Op = db.Sequelize.Op;

// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body.first_name 
    || !req.body.last_name
    || !req.body.gender
    || !req.body.date_of_birth
    || !req.body.contact_number
    || !req.body.email) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  }

  // Create a Customer
  const customer = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    contact_number: req.body.contact_number,
    email: req.body.email
  };

  // Save Customer in the database
  Customer.create(customer)
    .then(data => {
      res.status(200).send({ status: 200, message: "Success created" });
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        message: err.errors[0].message
      });
    });
};

const db = require("../models");
const Transaction = db.transactions;
const Balance = db.balances;
const Customer = db.customers;
const Op = db.Sequelize.Op;

// Create and Save a new Transaction
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email 
    || !req.body.total_spent) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  } else {
    if(req.body.total_spent < 0) {
      res.status(400).send({
        status: 400, message: "Your total spent cannot be less than 0!"
      });
      return;
    }
  }

  Customer.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(data => {
      if (data) {
        Balance.findOne({
          where: {
            customer_id: data.id
          }
        })
          .then(resBalance => {
            if(resBalance) {
              if(resBalance.balance < req.body.total_spent) {
                res.status(201).send({
                  status: 201,
                  message: `Your balance is not enough!`,
                  data: {
                    balance: resBalance.balance
                  }
                });
                return;
              }

              // Data transaction
              const transaction = {
                customer_id: data.id,
                total_spent: req.body.total_spent,
                total_saving: Number(resBalance.balance) - Number(req.body.total_spent)
              };

              // Update balance
              Balance.update({balance: transaction.total_saving}, {
                where: { customer_id: data.id }
              }).then(num => {
                // Save data transaction
                Transaction.create(transaction)
                .then(dataTrx => {
                  res.status(200).json({
                    status: 200,
                    message: "Success created transaction",
                    data: {
                      balance: transaction.total_saving
                    }
                  });
                }).catch(err => {
                  if(err.errors && err.errors.length > 0) {
                    res.status(500).send({
                      status: 500,
                      message: err.errors[0].message
                    });
                  }
                  res.status(500).send({
                    status: 500,
                    message: err.message || "Some error occurred while retrieving."
                  });
                });
              }).catch(err => {
                res.status(500).send({
                  message: "Error update balance!"
                });
              });

              
            } else {
              res.status(404).send({
                status: 404,
                message: `Your balance not found!`
              });
            }
          });
      } else {
        res.status(404).send({
          message: `Customer not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving."
      });
    });
};

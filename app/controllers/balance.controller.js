const db = require("../models");
const Customer = db.customers;
const Balance = db.balances;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.topup) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  }

  Customer.findOne({
    where: {
      email: req.body.email
    }
  }).then(async data => {

    let check_user = await Balance.findOne({
      where: {
        customer_id: data.id
      }
    });

    const balance = {
      customer_id: data.id,
      balance: req.body.topup
    };

    if(check_user) {
      await Balance.update({
        balance: Number(req.body.topup) + Number(check_user.balance)
      }, {
        where: {
          customer_id: data.id
        }
      }).then(data => {
        res.status(200).send({ 
          status: 200, 
          message: "Success created topup balance.",
          total_balance: Number(req.body.topup) + Number(check_user.balance)
        });
        return;
      })
      .catch(err => {
        res.status(500).send({
          status: 500,
          message: err.errors[0].message
        });
      });
      return;
    }
    Balance.create(balance)
    .then(r => {
      res.status(200).send({ 
        status: 200, 
        message: "Success created topup balance.",
        total_balance: Number(req.body.topup)
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        status: 500,
        message: err.errors[0].message
      });
    });
    return;
  }).catch(err => {
    res.status(500).send({
      message: "Error retrieving."
    });
    return;
  });
};

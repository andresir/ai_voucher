const db = require("../models");
const Voucher = db.vouchers;

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.add_voucher) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  }

  if(req.body.add_voucher === 0) {
    res.status(201).send({
      status: 201,
      message: 'Total create voucher greater than 0!'
    });
    return;
  }

  let arr_voucher = [];
  for(let i=0; i<req.body.add_voucher; i++) {
    let code_voucher = (Math.random() + 1).toString(36).substring(7);
    let obj_voucher = {
      customer_id: null,
      code_voucher: `voucher-${code_voucher}`,
      status: 'open',
      owner_date: null
    };
    arr_voucher.push(obj_voucher);
  }
  await Voucher.bulkCreate(arr_voucher)
  .then(data => {
    res.status(200).send({ 
      status: 200, 
      message: `Success create ${req.body.add_voucher} vouchers.`,
      data: {
        total_voucher: req.body.add_voucher
      }
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
};

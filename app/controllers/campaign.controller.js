const db = require("../models");
const Transaction = db.transactions;
const Customer = db.customers;
const Voucher = db.vouchers;
const Op = db.Sequelize.Op;
const { timing } = require('../helpers/timing');

// Check Voucher
exports.checking = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  }

  Customer.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(async data => {
    if (data) {
      let check_exist = await Voucher.findOne({
        where: {
          customer_id: data.id
        }
      });

      if(check_exist && check_exist.status === 'closed') {
        res.status(201).json({
          status: 201,
          message: "You already have a voucher!",
          data: {
            user_id: data.id,
            email: data.email,
            campaign_eligibility: true,
            code_voucher: check_exist.code_voucher,
            status_voucher: check_exist.status,
            is_expired: false
          }
        });
        return;
      }

      let now = new Date(new Date().setDate(new Date().getDate()));
      let backdate = new Date(new Date().setDate(new Date().getDate() - 30));

      let start_date = [
          backdate.getFullYear(),
          backdate.getMonth() + 1,
          backdate.getDate(),
        ].join('-');

      let end_date = [
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
        ].join('-');

      start_date = `${start_date} 00:00:00`;
      end_date = `${end_date} 23:59:59`;
    
      let count_trx = await Transaction.count({
        where: {
          transaction_at: {[Op.between]: [start_date, end_date]},
          customer_id: data.id
        }
      });

      let total_amount_trx = await Transaction.findAll({
        where: {
          transaction_at: {[Op.between]: [start_date, end_date]},
          customer_id: data.id
        },
        attributes: [
          'customer_id',
          [db.sequelize.fn('sum', db.sequelize.col('total_spent')), 'total_transaction'],
        ],
        group: ['customer_id'],
        raw: true
      });

      // Kualifikasi kampanye
      if (count_trx >= 3) {
        if(total_amount_trx && Number(total_amount_trx[0].total_transaction) >= 100) {
          let update_voucher = false;
          let data_voucher = await Voucher.findOne({
            where: {
              customer_id: data.id
            }
          });

          if(data_voucher === null) {
            data_voucher = {
              code_voucher: null,
              customer_id: null
            }
          }

          let check_voucher = await Voucher.findAll({
            where: {
              status: 'process'
            },
            order:[
              ["id","ASC"]
            ],
          });

          if(check_voucher) {
            for(let i=0; i<check_voucher.length; i++) {

              let checkExisting = await Voucher.findOne({
                where: {
                  customer_id: data.id,
                  status: 'process'
                }
              });

              let selisih = new Date().getTime() - check_voucher[i].owner_date.getTime();
              if(Number(selisih) > 600000 && checkExisting === null) {
                update_voucher = await Voucher.update({
                  customer_id: data.id,
                  owner_date: new Date()
                }, {
                  where: {
                    status: 'process',
                    owner_date: check_voucher[i].owner_date
                  },
                  limit: 1,
                  order:[
                    ["id","ASC"]
                  ],
                });

                if(update_voucher) {
                  data_voucher = await Voucher.findOne({
                    where: {
                      customer_id: data.id
                    }
                  });
                  res.status(200).json({
                    status: 200,
                    message: "You are entitled to a voucher!",
                    data: {
                      total_transaction: count_trx,
                      total_transaction_amount: total_amount_trx[0].total_transaction,
                      duration: `${start_date} until ${end_date}`,
                      campaign_eligibility: true,
                      time_expired: timing(data_voucher.owner_date)
                    }
                  });
                  return;
                }
              }
            }
          }

          // Check already have a voucher
          if(data_voucher.code_voucher !== null && data_voucher.customer_id) {
            let selisih = new Date().getTime() - data_voucher.owner_date.getTime();
            if(selisih > 600000) {
              data_voucher = await Voucher.findOne({
                where: {
                  customer_id: data.id
                }
              });

              if(data_voucher) {
                res.status(201).json({
                  status: 201,
                  message: "You already have a voucher!",
                  data: {
                    total_transaction: count_trx,
                    total_transaction_amount: total_amount_trx[0].total_transaction,
                    duration: `${start_date} until ${end_date}`,
                    campaign_eligibility: true,
                    time_expired: timing(data_voucher.owner_date)
                  }
                });
                return;
              }

              //Lock voucher duration 10 minute
              update_voucher = await Voucher.update({
                customer_id: data.id,
                status: 'process',
                owner_date: new Date()
              }, {
                where: {
                  id: data_voucher.id
                },
                limit: 1,
                order:[
                  ["id","ASC"]
                ],
              });

              if(update_voucher) {
                res.status(200).json({
                  status: 200,
                  message: "You are entitled to a voucher!",
                  data: {
                    total_transaction: count_trx,
                    total_transaction_amount: total_amount_trx[0].total_transaction,
                    duration: `${start_date} until ${end_date}`,
                    campaign_eligibility: true,
                    time_expired: timing(data_voucher.owner_date)
                  }
                });
                return;
              } else {
                res.status(403).json({
                  status: 403,
                  message: "Bad request!",
                  data: {}
                });
                return;
              }
            }
            res.status(201).json({
              status: 201,
              message: "You already have a voucher!",
              data: {
                total_transaction: count_trx,
                total_transaction_amount: total_amount_trx[0].total_transaction,
                duration: `${start_date} until ${end_date}`,
                campaign_eligibility: true,
                time_expired: timing(data_voucher.owner_date)
              }
            });
            return;
          }

          //new entry voucher - Lock voucher duration 10 minute
          update_voucher = await Voucher.update({
            customer_id: data.id,
            status: 'process',
          }, {
            where: {
              customer_id: null,
              status: 'open'
            },
            limit: 1,
            order:[
              ["id","ASC"]
            ],
          });
          if(update_voucher) {
            data_voucher = await Voucher.findOne({
              where: {
                customer_id: data.id
              }
            });
            if(data_voucher) {
              res.status(200).json({
                status: 200,
                message: "You are entitled to a voucher!",
                data: {
                  total_transaction: count_trx,
                  total_transaction_amount: total_amount_trx[0].total_transaction,
                  duration: `${start_date} until ${end_date}`,
                  campaign_eligibility: true,
                  time_expired: timing(data_voucher.owner_date)
                }
              });
              return;
            }
          }
        } else {
          res.status(201).json({
            status: 201,
            message: "Your total transaction is 3, but the amount is not sufficient at least 100!",
            data: {
              total_transaction: count_trx,
              total_transaction_amount: total_amount_trx[0].total_transaction,
              duration: `${start_date} until ${end_date}`,
              campaign_eligibility: false,
              time_expired: 0
            }
          });
          return;
        }
      } else {
        res.status(201).json({
          status: 201,
          message: "You don't have as many as 3 transactions!",
          data: {
            total_transaction: count_trx,
            total_transaction_amount: total_amount_trx[0].total_transaction,
            duration: `${start_date} until ${end_date}`,
            campaign_eligibility: false,
            time_expired: 0
          }
        });
        return;
      }
    } else {
      res.status(404).send({
        status: 404,
        message: `Customer not found.`,
        data: null
      });
      return;
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving."
    });
    return;
  });
};

// Validate photo submission
exports.validate_profile = (req, res) => {
  // Validate request
  if (!req.body.email
    && !req.body.img_profile) {
    res.status(400).send({
      status: 400, message: "Content can not be empty!"
    });
    return;
  }

  Customer.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(async data => {
    if (data) {
      if(!req.body.img_profile) {
        res.status(201).json({
          status: 201,
          message: "Validation image profile not valid",
          data: {
            user_id: data.id,
            email: data.email,
            campaign_eligibility: false,
          }
        });
        return;
      }

      let check_voucher = await Voucher.findOne({
        where: {
          customer_id: data.id
        }
      });

      if (!check_voucher) {
        res.status(404).json({
          status: 404,
          message: "Voucher not found!",
          data: {
            user_id: data.id,
            email: data.email,
            campaign_eligibility: false,
          }
        });
        return;
      }

      if(check_voucher.status === 'closed') {
        res.status(201).json({
          status: 201,
          message: "Voucher is closed!",
          data: {
            user_id: data.id,
            email: data.email,
            campaign_eligibility: true,
            code_voucher: check_voucher.code_voucher,
            status_voucher: check_voucher.status,
            is_expired: false
          }
        });
        return;
      }

      let selisih = new Date().getTime() - check_voucher.owner_date.getTime();
      if(Number(selisih) > 600000) {
        res.status(201).json({
          status: 201,
          message: "Voucher expired!",
          data: {
            user_id: data.id,
            email: data.email,
            campaign_eligibility: false,
            code_voucher: null,
            status_voucher: 'open',
            is_expired: true
          }
        });
        return;
      }

      await Voucher.update({
        customer_id: data.id,
        status: 'closed'
      }, {
        where: {
          id: check_voucher.id
        }
      });

      res.status(200).json({
        status: 200,
        message: "Yeah, you get a voucher!",
        data: {
          user_id: data.id,
          email: data.email,
          campaign_eligibility: true,
          code_voucher: check_voucher.code_voucher,
          status_voucher: check_voucher.status,
          is_expired: false
        }
      });
      return;
    } else {
      res.status(404).send({
        status: 404,
        message: `Customer not found.`,
        data: null
      });
      return;
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving."
    });
    return;
  });
};

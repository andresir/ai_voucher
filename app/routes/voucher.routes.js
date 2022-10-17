module.exports = app => {
  const voucher = require("../controllers/voucher.controller.js");

  const router = require("express").Router();
  router.post("/add", voucher.create);

  app.use('/api/voucher', router);
};

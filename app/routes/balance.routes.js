module.exports = app => {
  const balance = require("../controllers/balance.controller.js");

  const router = require("express").Router();
  router.post("/topup", balance.create);

  app.use('/api/balance', router);
};

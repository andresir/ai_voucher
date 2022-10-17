module.exports = app => {
  const transaction = require("../controllers/transaction.controller.js");

  const router = require("express").Router();
  router.post("/add", transaction.create);

  app.use('/api/transaction', router);
};

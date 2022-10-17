module.exports = app => {
  const customer = require("../controllers/customer.controller.js");

  const router = require("express").Router();
  router.post("/add", customer.create);

  app.use('/api/customer', router);
};

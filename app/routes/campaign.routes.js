module.exports = app => {
  const campaign = require("../controllers/campaign.controller.js");

  const router = require("express").Router();
  router.post("/checking", campaign.checking);
  router.post("/validate-profile", campaign.validate_profile);

  app.use('/api/campaign', router);
};

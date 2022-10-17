const express = require("express");
const cors = require("cors");
const app = express();

const routeCustomers = require("./app/routes/customer.routes");
const routeTransactions = require("./app/routes/transaction.routes");
const routeCheckingCampaign = require("./app/routes/campaign.routes");
const routeValidateCampaign = require("./app/routes/campaign.routes");
const routeBalance = require("./app/routes/balance.routes");
const routeVoucher = require("./app/routes/voucher.routes");

const db = require("./app/models");
db.sequelize.sync();

// In development, you may need to drop existing tables and re-sync database. Just use force: true
db.sequelize.sync({ force: false, logging: console.log }).then(() => {
  console.log("Drop and re-sync db.");
});

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// cors for white origin domain FE
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Voucher App Campaign." });
});

routeCustomers(app);
routeTransactions(app);
routeCheckingCampaign(app);
routeValidateCampaign(app);
routeBalance(app);
routeVoucher(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

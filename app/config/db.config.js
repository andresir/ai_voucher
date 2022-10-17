module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "arzaqi212",
  DB: "aichat_voucher",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

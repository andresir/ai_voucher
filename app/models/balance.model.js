module.exports = (sequelize, Sequelize) => {
  const Balances = sequelize.define("balances", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      foreignKey: true,
      references: {
        model: "Customers",
        key: "id"
      }
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });

  return Balances;
};

module.exports = (sequelize, Sequelize) => {
  const Transactions = sequelize.define("purchase_transaction", {
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
    total_spent: {
      type: "DECIMAL(10,2)",
      allowNull: false
    },
    total_saving: {
      type: "DECIMAL(10,2)",
      allowNull: false
    },
    transaction_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });

  return Transactions;
};

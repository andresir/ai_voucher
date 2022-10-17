module.exports = (sequelize, Sequelize) => {
  const Vouchers = sequelize.define("vouchers", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
      foreignKey: true,
      references: {
        model: "Customers",
        key: "id"
      }
    },
    code_voucher: {
      type: "VARCHAR(50)",
      allowNull: false
    },
    status: {
      type: "VARCHAR(50)",
      allowNull: false,
      defaultValue: "open",
      comment: "open, process, closed"
    },
    owner_date: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
      allowNull: true
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });

  return Vouchers;
};

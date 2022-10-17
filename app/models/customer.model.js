module.exports = (sequelize, Sequelize) => {
  const Customers = sequelize.define("customers", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    last_name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    gender: {
      allowNull: false,
      type: "VARCHAR(50)"
    },
    date_of_birth: {
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    contact_number: {
      allowNull: false,
      type: "VARCHAR(50)"
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false
    },
    updated_at: {
      type: "TIMESTAMP",
      allowNull: true
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });

  return Customers;
};

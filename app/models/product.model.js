module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define("products", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    product_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    product_price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  }, {
    timestamps: false,
    underscored: true,
    freezeTableName: true
  });

  return Products;
};

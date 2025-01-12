const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Customer = db.define('customer', {
  id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  autoIncrement: true,
  primaryKey: true
  },
  name: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Customer;

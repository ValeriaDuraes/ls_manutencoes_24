const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const Customer = require('./Customer');

const Machine = db.define('machine', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  m_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  m_model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  voltage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serial_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  acessories: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observations: {
    type: DataTypes.STRING,
    allowNull: true
  },
  service_cost: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true
  },
  parts: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status_budget: {
    type: DataTypes.ENUM('pending', 'approved', 'reject'),
    allowNull: false,
    defaultValue: 'pending'
  },
  status_delivery: {
    type: DataTypes.ENUM('not_delivered', 'delivered'),
    allowNull: false,
    defaultValue: 'not_delivered'
  },
  status_payment: {
    type: DataTypes.ENUM('pending', 'paid', 'unpaid'),
    allowNull: false,
    defaultValue: 'unpaid'
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'transfer', 'bank_slip', 'other'),
    allowNull: true
  },
  service_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

Machine.belongsTo(Customer, {
  foreignKey: {
    allowNull: false
  }
});
Customer.hasMany(Machine, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = Machine;

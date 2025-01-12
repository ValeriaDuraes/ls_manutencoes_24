const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

const checkAuth = require('../helpers/auth').checkAuth;


router.get('/customers', checkAuth, CustomerController.showCustomers);

module.exports = router;

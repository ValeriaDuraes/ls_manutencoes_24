const Customer = require('../models/Customer');

module.exports = class CustomerController {
  static showCustomers(req, res) {
    Customer.findAll()
      .then((data) => {
        // Converte os objetos Sequelize para objetos planos
        const customers = data.map((result) => result.get({ plain: true }));

        res.render('customers/customers', { customers });
      })
      .catch((err) => {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).send('Erro ao carregar clientes.');
      });
  }
}

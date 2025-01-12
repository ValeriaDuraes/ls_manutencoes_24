const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lsmanutencoes_24', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conectamos com sucesso na porta 3000!`);
  } catch (err) {
    console.log(`Não foi possível conectar: ${err}`);
  }
})();

module.exports = sequelize;




// const { pool } = require('pg');

// const pool = new pool({
//   user: postgres,
//   database: ls_manutencoes,
//   host: localhost,
//   port: 5433,
//   password: postgres,
// })

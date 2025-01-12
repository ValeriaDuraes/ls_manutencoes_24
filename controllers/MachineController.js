const Machines = require('../models/Machines');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');

module.exports = class MachineController {
  static async showMachines(req, res) {
    res.render('machines/home')
  }

  static async dashboard(req, res) {
    res.render('machines/dashboard')
  }

  static async createMachine(req, res) {
    try {
      const customers = await Customer.findAll({ raw: true });
      res.render('machines/create', { customers });
    } catch (error) {
      console.log('Erro ao carregar clientes na MachineController.js - func createMachine...', error);
      res.status(500).send('Erro ao carregar clientes, contate o suporte do sistema!');
    }
  }

  static async createMachineSave(req, res) {
    try {
      const machineData = {
        customerId: req.body.customer_id,
        m_name: req.body.m_name,
        m_model: req.body.m_model || null, 
        voltage: req.body.voltage,
        brand: req.body.brand || null,
        serial_number: req.body.serial_number || null,
        acessories: req.body.acessories || null,
        observations: req.body.observations || null,
        service_cost: req.body.service_cost ? parseFloat(req.body.service_cost) : null,
        parts: req.body.parts || null,
        status_budget: req.body.status_budget || "pending",
        status_delivery: req.body.status_delivery || "not_delivered",
        status_payment: req.body.status_payment || "unpaid",
        payment_method: req.body.payment_method || "other",
        service_date: req.body.service_date || null,
      };

        const newMachine = await Machines.create(machineData);
        const machineId = newMachine.id; 
        console.log('Máquina criada', newMachine);
        console.log('Id da máquina criada', newMachine.id);
        // return res.status(201).json(newMachine);
        
        req.flash('info', `O.S criada com sucesso! Número da O.S: ${machineId}`);
        req.session.save(() => {
          res.redirect('/machines/dashboard');
        })
      } catch (error) {
        console.log('Erro ao salvar O.S - ao MachineController - func createMachineSave', error);
        req.flash('info', 'Erro ao criar O.S!');
        req.session.save(() => {
          res.redirect('/machines/dashboard');
        });
      }
  }

  static async getAllMachines(req, res) {
    try {
      const allMachines = await Machines.findAll({
        include: [
          {
            model: Customer,
            attributes: ['name', 'id', 'phone'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      // console.log(allMachines);

      res.render('machines/allmachines', { machines: allMachines });
      // console.log("Rota 'machines/allmachines' acessada.");
    } catch (error) {
      console.log('Erro ao buscar todas as O.S, MachineController - func getAllMachines', error);
      res.status(500).send('Erro ao carregar as O.Ss!');
    }
  }

  static async filterMachines(req, res) {
    try {
      const {customer_name, customer_id, phone, machine_id, machine_model} = req.query;

      const filterConditions = {};

      if(customer_name && customer_name.trim() !== ''){
        filterConditions['$customer.name$'] = { [Op.iLike]: `%${customer_name.trim()}%` };
      }
      if(customer_id && customer_id.trim() !== ''){
        filterConditions['$customer.id$'] = customer_id.trim();
      }
      if(phone && phone.trim() !== ''){
        filterConditions['$customer.phone$'] = { [Op.iLike]: `%${phone.trim()}%` };
      }
      if(machine_id && machine_id.trim() !== ''){
        // filterConditions['$machine.id$'] = machine_id;
        filterConditions.id = machine_id.trim();
      }
      if(machine_model && machine_model.trim() !== ''){
        filterConditions['machine.m_model'] = { [Op.iLike]: `%${machine_model.trim()}%` };
      }

      const filteredMachines = await Machines.findAll({
        where: filterConditions,
        include: [
          {
            model: Customer,
            attributes: ['id', 'name', 'phone'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.render('machines/allmachines', { machines: filteredMachines })
      // req.flash('info', `O.S encontrada!`);
      // req.session.save(() => {
      //   res.redirect('/machines/dashboard');
      // })
    } catch (error) {
      console.log('Erro ao filtrar O.S!', error);
      // res.status(500).send('Erro ao filtrar O.S!');
      req.flash('info', 'Erro ao filtrar O.S!! Tente outro filtro!');
      req.session.save(() => {
        res.redirect('/machines/allmachines');
      });
    }
  }

  static async editMachine(req, res) {
    try {
      const { id } = req.params;
      const machine = await Machines.findOne({
        where: { id },
        include: [{
          model: Customer,
          attributes: ['id', 'name', 'phone'],
         },],
      });

      if(!machine) {
        req.flash('info', 'O.S não encontrada!');
        return res.status(404).send('O.S não encontrada!');
      }

      res.render('machines/editmachine', { machine });
    } catch (error) {
      console.error('Erro ao carregar o formulário de edição!', error);
      res.status(500).send('Erro ao carregar o formulário de edição!')
    }
  }

  static async updateMachine(req, res) {
    try {
      const { id } = req.params;
      const {
        customer_id,
        m_name,
        m_model,
        voltage,
        brand,
        serial_number,
        acessories,
        observations,
        service_cost,
        parts,
        status_budget,
        status_delivery,
        status_payment,
        payment_method,
        service_date,
      } = req.body;

      await Machines.update(
        {
          customer_id,
          m_name,
          m_model,
          voltage,
          brand,
          serial_number,
          acessories,
          observations,
          service_cost,
          parts,
          status_budget,
          status_delivery,
          status_payment,
          payment_method,
          service_date,
      },{ where: { id }}
    );

    req.flash('info', 'O.S atualizada com sucesso!');
    res.redirect(`/machines/filter?machine_id=${id}&customer_id=${customerId}&customer_name=${encodeURIComponent(customer_name)}`);
    } catch (error) {
      console.error('Erro ao atualizar a O.S', error);
      res.status(500).send('Erro ao atualizar a O.S');
    }
  }

  static async deleteMachine(req, res) {
    try {
      const { id } = req.params;

      await Machines.destroy({ where: { id }});

      req.flash('info', 'O.S deletada com sucesso!');
      res.redirect('/machines/allmachines');

    } catch (error) {
      console.error('Houve um erro ao deletar a O.S!', error);
      res.status(500).send('Houve um erro ao deletar a O.S!');
    }
  }
}

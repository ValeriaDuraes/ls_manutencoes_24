const express = require('express');
const router = express.Router();
const MachineController = require('../controllers/MachineController');

// Helpers
const checkAuth = require('../helpers/auth').checkAuth;

router.get('/add', checkAuth, MachineController.createMachine);
router.post('/add', checkAuth, MachineController.createMachineSave);

router.get('/dashboard', checkAuth, MachineController.dashboard);
router.get('/', checkAuth, MachineController.showMachines);
router.get('/allmachines', checkAuth, MachineController.getAllMachines);
router.get('/filter', checkAuth, MachineController.filterMachines);

router.get('/edit/:id', checkAuth, MachineController.editMachine);
router.post('/edit/:id', checkAuth, MachineController.updateMachine);
router.post('/delete/:id', checkAuth, MachineController.deleteMachine);

module.exports = router;

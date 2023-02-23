const express = require('express');
const contractsController = require('../controllers/contracts');
const { getProfile } = require('../middleware/getProfile');

const router = express.Router();

router.get('/:id', getProfile, contractsController.getContractById);
router.get('/', getProfile, contractsController.getNonTerminatedContracts);

module.exports = router;

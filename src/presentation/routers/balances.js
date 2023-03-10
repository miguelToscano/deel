const express = require('express');
const balancesController = require('../controllers/balances');
const { getProfile } = require('../middleware/getProfile');

const router = express.Router();

router.post('/deposit/:userId', getProfile, balancesController.deposit);

module.exports = router;

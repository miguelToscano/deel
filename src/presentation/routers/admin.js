const express = require('express');
const adminsController = require('../controllers/admins');
const { getProfile } = require('../middleware/getProfile');

const router = express.Router();

router.get('/best-profession', getProfile, adminsController.getBestProfession);
router.get('/best-clients', getProfile, adminsController.getBestClients);

module.exports = router;

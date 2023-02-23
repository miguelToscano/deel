const express = require('express');
const profilesController = require('../controllers/profiles');
const { getProfile } = require('../middleware/getProfile');

const router = express.Router();

router.get('/', getProfile, profilesController.getProfiles);

module.exports = router;

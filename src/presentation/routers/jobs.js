const express = require('express');
const jobsController = require('../controllers/jobs');
const { getProfile } = require('../middleware/getProfile');

const router = express.Router();

router.get('/unpaid', getProfile, jobsController.getUnpaidJobs);
router.get('/', getProfile, jobsController.getJobs);
router.post('/:id/pay', getProfile, jobsController.payJob);

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { sequelize } = require('../../infrastructure/model');
const { getProfile } = require('../middleware/getProfile');
const { handleError } = require('../middleware/handleError');

const jobsController = require('../controllers/jobs');
const contractsController = require('../controllers/contracts');
const profilesController = require('../controllers/profiles');
const balancesController = require('../controllers/balances');
const adminsController = require('../controllers/admins');

const adminsRouter = require('../routers/admin');
const balancesRouter = require('../routers/balances');
const contractsRouter = require('../routers/contracts');
const jobsRouter = require('../routers/jobs');
const profilesRouter = require('../routers/profiles');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/admin', adminsRouter);
app.use('/balances', balancesRouter);
app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/profiles', profilesRouter);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, contractsController.getContractById);
app.get('/contracts', getProfile, contractsController.getNonTerminatedContracts);
app.get('/jobs/unpaid', getProfile, jobsController.getUnpaidJobs);
app.get('/jobs', getProfile, jobsController.getJobs);
app.post('/jobs/:id/pay', getProfile, jobsController.payJob);
app.post('/balance/deposit/:userId', getProfile, balancesController.deposit);
app.get('/admin/best-profession', getProfile, adminsController.getBestProfession);
app.get('/admin/best-clients', getProfile, adminsController.getBestClients);

app.get('/profiles', profilesController.getProfiles);

app.use(handleError);

module.exports = app;

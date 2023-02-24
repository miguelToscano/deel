const profilesRepository = require('../infrastructure/repositories/profiles');
const jobsRepository = require('../infrastructure/repositories/jobs');
const { sequelize } = require('../infrastructure/model');
const { IN_PROGRESS_STATUS } = require('./contracts');
const {
  createError, PROFILE_NOT_FOUND, PROFILE_HAS_TOO_MUCH_DEBT, BAD_PARAMS,
} = require('./errors');

const MAX_DEBT_THRESHOLD_MULTIPLIER = 0.25;

const validateDeposit = async (profileId, amount, options) => {
    const unpaidJobs = await jobsRepository.getUnpaidJobs(profileId, IN_PROGRESS_STATUS, options);
    const totalDebt = unpaidJobs.reduce((acc, job) => acc + job.price, 0);
    if (totalDebt && amount > totalDebt * MAX_DEBT_THRESHOLD_MULTIPLIER) {
      throw createError(PROFILE_HAS_TOO_MUCH_DEBT);
    }
};

const deposit = async (fromId, toId, amount) => {
  const transaction = await sequelize.transaction();

  const options = {
    transaction,
    lock: transaction.LOCK.UPDATE,
  };

  try {
    if (amount === 0) {
      throw createError(BAD_PARAMS);
    }

    const [fromProfile, toProfile] = await Promise.all([
      profilesRepository.getProfileById(fromId, options),
      profilesRepository.getProfileById(toId, options),
    ]);

    if (!fromProfile || !toProfile) {
      throw createError(PROFILE_NOT_FOUND);
    }

    if (fromProfile.type === 'client') {
      await validateDeposit(fromId, amount, options);
    }

    await profilesRepository.addBalance(toId, amount, options);

    await transaction.commit();

    return;
  } catch (error) {
    await transaction.rollback();
    console.log(JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  deposit,
};

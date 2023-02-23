const profilesRepository = require('../infrastructure/repositories/profiles');
const jobsRepository = require('../infrastructure/repositories/jobs');
const { sequelize } = require('../infrastructure/model');
const {
  createError, PROFILE_NOT_FOUND, PROFILE_HAS_TOO_MUCH_DEBT, BAD_PARAMS,
} = require('./errors');

const MAX_DEBT_THRESHOLD_MULTIPLIER = 0.25;

const validateDeposit = async (profile, amount, options) => {
  if (profile.get('type') === 'client') {
    const unpaidJobs = await jobsRepository.getUnpaidJobs(profile.get('id'), options);

    const totalDebt = unpaidJobs.reduce((acc, job) => acc + job.get('price'), 0);

    if (amount > totalDebt * MAX_DEBT_THRESHOLD_MULTIPLIER) {
      throw createError(PROFILE_HAS_TOO_MUCH_DEBT);
    }
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

    await validateDeposit(fromProfile, amount, options);

    await profilesRepository.addBalance(toId, amount, options);

    // await new Promise((resolve) => setTimeout(resolve, 5000));

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

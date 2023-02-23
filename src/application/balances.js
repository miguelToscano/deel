const profilesRepository = require('../infrastructure/repositories/profiles');
const jobsRepository = require('../infrastructure/repositories/jobs');
const { sequelize } = require('../infrastructure/model');
const { createError, PROFILE_NOT_FOUND, PROFILE_HAS_TOO_MUCH_DEBT } = require('./errors');

const MAX_DEBT_THRESHOLD_MULTIPLIER = 0.25;

const deposit = async (from, to, amount) => {
  const transaction = await sequelize.transaction();

  const options = {
    transaction,
    lock: transaction.LOCK.UPDATE,
  };

  try {
    const [fromProfile, toProfile] = await Promise.all([
      profilesRepository.getProfileById(from, options),
      profilesRepository.getProfileById(to, options),
    ]);

    if (!fromProfile || !toProfile) {
      throw createError(PROFILE_NOT_FOUND);
    }

    const unpaidJobs = await jobsRepository.getUnpaidJobs(from, options);

    const totalDebt = unpaidJobs.reduce((acc, job) => acc + job.get('price'), 0);

    if (amount > totalDebt * MAX_DEBT_THRESHOLD_MULTIPLIER) {
      throw createError(PROFILE_HAS_TOO_MUCH_DEBT);
    }

    await profilesRepository.addBalance(to, amount, options);

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

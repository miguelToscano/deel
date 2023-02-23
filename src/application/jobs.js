const jobsRepository = require('../infrastructure/repositories/jobs');
const profilesRepository = require('../infrastructure/repositories/profiles');
const {
  createError, JOB_NOT_FOUND, JOB_ALREADY_PAID, PROFILE_HAS_NOT_ENOUGH_BALANCE, PROFILE_NOT_FOUND,
} = require('./errors');
const { sequelize } = require('../infrastructure/model');

const getUnpaidJobs = async (profileId) => {
  try {
    const jobs = await jobsRepository.getUnpaidJobs(profileId);
    console.log(jobs);
    return jobs;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getJobs = async (profileId) => {
  try {
    const jobs = await jobsRepository.getJobs(profileId);
    console.log(jobs);
    return jobs;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const payJob = async (profileId, jobId) => {
  const transaction = await sequelize.transaction();
  const options = {
    transaction,
    lock: transaction.LOCK.UPDATE,
  };

  try {
    const job = await jobsRepository.getJobById(profileId, jobId, options);

    if (!job) {
      throw createError(JOB_NOT_FOUND);
    }

    if (job.get('paid')) {
      throw createError(JOB_ALREADY_PAID);
    }

    const [payingProfile, profileToBePaid] = await Promise.all([
      profilesRepository.getProfileById(profileId, options),
      profilesRepository.getProfileById(job.get('Contract').get('ContractorId'), options),
    ]);

    if (!profileToBePaid || !payingProfile) {
      throw createError(PROFILE_NOT_FOUND);
    }

    if (payingProfile.get('balance') < job.get('price')) {
      throw createError(PROFILE_HAS_NOT_ENOUGH_BALANCE);
    }

    await Promise.all([
      profilesRepository.addBalance(profileToBePaid.get('id'), job.get('price'), options),
      profilesRepository.subtractBalance(payingProfile.get('id'), job.get('price'), options),
      jobsRepository.markJobAsPaid(profileId, jobId, options),
    ]);

    await transaction.commit();

    return;
  } catch (error) {
    await transaction.rollback();

    console.log(JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  getUnpaidJobs,
  getJobs,
  payJob,
};

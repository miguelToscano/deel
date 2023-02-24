const jobsRepository = require('../infrastructure/repositories/jobs');
const profilesRepository = require('../infrastructure/repositories/profiles');
const contractsRepository = require('../infrastructure/repositories/contracts');
const { IN_PROGRESS_STATUS } = require('./contracts');
const {
  createError, JOB_NOT_FOUND, JOB_ALREADY_PAID, PROFILE_HAS_NOT_ENOUGH_BALANCE, PROFILE_NOT_FOUND, CONTRACT_NOT_FOUND,
} = require('./errors');
const { sequelize } = require('../infrastructure/model');

const getUnpaidJobs = async (profileId) => {
  try {
    const jobs = await jobsRepository.getUnpaidJobs(profileId, IN_PROGRESS_STATUS);
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

    if (job.paid) {
      throw createError(JOB_ALREADY_PAID);
    }

    const contract = await contractsRepository.getContractById(profileId, job.ContractId, options);

    if (!contract) {
      throw createError(CONTRACT_NOT_FOUND);
    }

    const [payingProfile, payedProfile] = await Promise.all([
      profilesRepository.getProfileById(profileId, options),
      profilesRepository.getProfileById(contract.ContractorId, options),
    ]);

    if (!payedProfile || !payingProfile) {
      throw createError(PROFILE_NOT_FOUND);
    }

    if (payingProfile.balance < job.price) {
      throw createError(PROFILE_HAS_NOT_ENOUGH_BALANCE);
    }

    console.log('llega aca');

    await Promise.all([
      profilesRepository.addBalance(payedProfile.id, job.price, options),
      profilesRepository.subtractBalance(payingProfile.id, job.price, options),
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

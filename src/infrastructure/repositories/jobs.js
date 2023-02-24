const { Op } = require('sequelize');
const { Job, Contract } = require('../model');

const serializeJob = (job) => {
  const serializedJob = { ...job.dataValues };
  delete serializedJob.Contract;
  return serializedJob;
};

const getUnpaidJobs = async (profileId, unpaidStatus, options) => {
  try {
    const jobs = await Job.findAll({
      where: {
        paid: {
          [Op.or]: [null, 0, false],
        },
      },
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          status: {
            [Op.eq]: unpaidStatus,

          },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    return jobs.map(serializeJob);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getUnpaidJobById = async (profileId, jobId, options) => {
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: {
          [Op.or]: [null, 0, false],
        },
      },
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          status: {
            [Op.eq]: 'in_progress',
          },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    return job && serializeJob(job);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getJobs = async (profileId, options) => {
  try {
    const jobs = await Job.findAll({
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    return jobs && jobs.map(serializeJob);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getJobById = async (profileId, jobId, options) => {
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
      },
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          status: {
            [Op.eq]: 'in_progress',
          },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    return job && serializeJob(job);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const markJobAsPaid = async (profileId, jobId, options) => {
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: {
          [Op.or]: [null, 0, false],
        },
      },
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          status: {
            [Op.eq]: 'in_progress',
          },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    job.set({
      paid: true,
      paymentDate: new Date(),
    });

    await job.save({ ...options });

    return;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  getUnpaidJobs,
  getUnpaidJobById,
  getJobById,
  getJobs,
  markJobAsPaid,
};

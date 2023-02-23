const { Op } = require('sequelize');
const { Job, Contract } = require('../model');

const getUnpaidJobs = async (profileId, options) => {
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
            [Op.eq]: 'in_progress',

          },
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
      ...options,
    });

    return jobs.map((job) => ({
      id: job.dataValues.id,
      title: job.dataValues.title,
      description: job.dataValues.description,
      price: job.dataValues.price,
      paid: job.dataValues.paid,
      paymentDate: job.dataValues.paymentDate,
      contractId: job.dataValues.ContractId,
    }));
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

    if (!job) return null;

    return {
      id: job.dataValues.id,
      title: job.dataValues.title,
      description: job.dataValues.description,
      price: job.dataValues.price,
      paid: job.dataValues.paid,
      paymentDate: job.dataValues.paymentDate,
      contractId: job.dataValues.ContractId,
    };
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

    return jobs.map((job) => ({
      id: job.dataValues.id,
      title: job.dataValues.title,
      description: job.dataValues.description,
      price: job.dataValues.price,
      paid: job.dataValues.paid,
      paymentDate: job.dataValues.paymentDate,
      contractId: job.dataValues.ContractId,
    }));
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

    return job;
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

    if (!job) return null;

    job.paid = true;
    job.paymentDate = new Date();

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

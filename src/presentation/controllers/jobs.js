const jobsService = require('../../application/jobs');

const getUnpaidJobs = async (req, res, next) => {
  try {
    const jobs = await jobsService.getUnpaidJobs(req.profile.id);
    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await jobsService.getJobs(req.profile.id);
    return res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

const payJob = async (req, res, next) => {
  try {
    await jobsService.payJob(req.profile.id, req.params.id);
    return res.status(200).json({ message: 'Job paid successfully' });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

module.exports = {
  getUnpaidJobs,
  getJobs,
  payJob,
};

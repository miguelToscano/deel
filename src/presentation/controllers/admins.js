const profilesService = require('../../application/profiles');

const getBestProfession = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const bestProfession = await profilesService.getBestProfession(start, end);
    return res.status(200).json({ ...bestProfession });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

const getBestClients = async (req, res, next) => {
  try {
    const { start, end, limit } = req.query;
    const bestClients = await profilesService.getBestClients(start, end, limit);
    return res.status(200).json(bestClients);
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

module.exports = {
  getBestProfession,
  getBestClients,
};

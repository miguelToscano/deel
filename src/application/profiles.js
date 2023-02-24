const dayjs = require('dayjs');

const profilesRepository = require('../infrastructure/repositories/profiles');
const { createError, BAD_PARAMS, BEST_PROFESSION_NOT_FOUND } = require('./errors');

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GET_BEST_CLIENTS_DEFAULT_LIMIT = 2;

const getProfiles = async () => {
  try {
    const profiles = await profilesRepository.getProfiles();
    return profiles;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const getBestProfession = async (startTime, endTime) => {
  try {
    if (!startTime || !endTime || startTime >= endTime) {
      throw createError(BAD_PARAMS);
    }

    const formattedStartTime = dayjs(startTime).format(TIME_FORMAT);
    const formattedEndTime = dayjs(endTime).format(TIME_FORMAT);

    const bestProfession = await profilesRepository.getBestProfession(formattedStartTime, formattedEndTime);

    if (!bestProfession) {
      throw createError(BEST_PROFESSION_NOT_FOUND);
    }

    return bestProfession;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const getBestClients = async (startTime, endTime, limit = GET_BEST_CLIENTS_DEFAULT_LIMIT) => {
  try {
    if (!startTime || !endTime || startTime >= endTime) {
      throw createError(BAD_PARAMS);
    }

    const formattedStartTime = dayjs(startTime).format(TIME_FORMAT);
    const formattedEndTime = dayjs(endTime).format(TIME_FORMAT);
    const bestClients = await profilesRepository.getBestClients(formattedStartTime, formattedEndTime, limit);
    return bestClients || [];
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

module.exports = {
  getProfiles,
  getBestProfession,
  getBestClients,
};

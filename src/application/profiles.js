const dayjs = require('dayjs');

const profilesRepository = require('../infrastructure/repositories/profiles');
const { createError, BAD_PARAMS } = require('./errors');

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

    console.log(startTime, endTime);

    const formattedStartTime = dayjs(startTime).format(TIME_FORMAT);
    const formattedEndTime = dayjs(endTime).format(TIME_FORMAT);

    const test = new Date(formattedStartTime);
    console.log(test);

    const bestProfession = await profilesRepository.getBestProfession(formattedStartTime, formattedEndTime);

    return bestProfession ? bestProfession.dataValues : {};
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
    console.log('llega aca');
    const bestClients = await profilesRepository.getBestClients(formattedStartTime, formattedEndTime, limit);
    return bestClients && bestClients.length ? bestClients.map((bestClient) => bestClient.dataValues) : [];
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

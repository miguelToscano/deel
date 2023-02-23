const profilesRepository = require('../infrastructure/repositories/profiles');

const getProfiles = async () => {
  try {
    const profiles = await profilesRepository.getProfiles();
    return profiles;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

module.exports = {
  getProfiles,
};

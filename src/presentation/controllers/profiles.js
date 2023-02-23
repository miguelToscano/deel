const profilesService = require('../../application/profiles');

const getProfiles = async (req, res, next) => {
  try {
    const profiles = await profilesService.getProfiles();
    return res.status(200).json({
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

module.exports = {
  getProfiles,
};

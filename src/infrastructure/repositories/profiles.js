const { Profile } = require('../model');

const getProfileById = async (profileId, options) => {
  try {
    const profile = await Profile.findOne({ where: { id: profileId }, ...options });
    return profile;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const getProfiles = async () => {
  try {
    const profiles = await Profile.findAll();
    return profiles;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const getProfileDebt = async (profileId, options) => {
  try {
    const profile = await Profile.findOne({ where: { id: profileId }, ...options });
    return profile.get('debt');
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const subtractBalance = async (profileId, amount, options) => {
  try {
    const profile = await Profile.findOne({ where: { id: profileId }, ...options });
    const newBalance = profile.get('balance') - amount;
    profile.set({ balance: newBalance });
    await profile.save({ ...options });
    return;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const addBalance = async (profileId, amount, options) => {
  try {
    const profile = await Profile.findOne({ where: { id: profileId }, ...options });
    const newBalance = profile.get('balance') + amount;
    profile.set({ balance: newBalance });
    await profile.save({ ...options });
    return;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

module.exports = {
  getProfileById,
  getProfiles,
  getProfileDebt,
  subtractBalance,
  addBalance,
};

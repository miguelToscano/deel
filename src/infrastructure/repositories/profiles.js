const { Op, col } = require('sequelize');
const {
  Profile, Contract, Job, sequelize,
} = require('../model');

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

// fix
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

const getBestProfession = async (startTime, endTime) => {
  try {
    console.log(startTime, endTime);
    const bestProfessions = await Profile.findAll({
      attributes: ['profession', [sequelize.fn('SUM', col('Contractor.Jobs.price')), 'total']],
      where: {
        type: 'contractor',
      },
      group: ['profession'],
      include: [
        {
          model: Contract,
          as: 'Contractor',
          attributes: [],
          include: [
            {
              model: Job,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.between]: [startTime, endTime],
                },
              },
            },
          ],
        },
      ],
      order: [['total', 'DESC']],
    });

    return bestProfessions && bestProfessions.length && bestProfessions[0].get('total') && bestProfessions[0];
  } catch (error) {
    console.log(JSON.stringify(error));
    throw (error);
  }
};

const getBestClients = async (startTime, endTime, limit) => {
  try {
    console.log(startTime, endTime);
    console.log('antes de la query');
    const bestClients = await Profile.findAll({
      subQuery: false,
      attributes: ['id', [sequelize.fn('SUM', col('Client.Jobs.price')), 'paid'], [sequelize.literal("firstName || ' ' || lastName"), 'fullName']],
      group: ['Profile.id'],
      order: [['paid', 'DESC']],
      where: { type: 'client' },
      include: [{
        model: Contract,
        attributes: [],
        as: 'Client',
        include: [{
          model: Job,
          attributes: [],
          where: { paid: true, paymentDate: { [Op.between]: [startTime, endTime] } },
        }],
      }],
      limit,
    });

    console.log(bestClients);

    return bestClients && bestClients.length && bestClients[0].get('paid') && bestClients.filter((bestClient) => bestClient.get('paid') !== null);
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
  getBestProfession,
  getBestClients,
};

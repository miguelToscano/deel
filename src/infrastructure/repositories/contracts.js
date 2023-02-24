const { Op } = require('sequelize');
const { Contract } = require('../model');

const serializeContract = (contract) => {
  const serializedContract = { ...contract.dataValues };
  return serializedContract;
}

const getContracts = async () => {
  try {
    const contracts = await Contract.findAll();

    return contracts.map(serializeContract);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getContractById = async (profileId, contractId) => {
  try {
    const contract = await Contract.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    });

    return contract && serializeContract(contract);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getNonTerminatedContracts = async (profileId) => {
  try {
    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        status: {
          [Op.not]: 'terminated',
        },
      },
    });

    return contracts.map(serializeContract);
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  getContracts,
  getContractById,
  getNonTerminatedContracts,
};

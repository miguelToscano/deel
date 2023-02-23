const contractsRepository = require('../infrastructure/repositories/contracts');
const { createError, CONTRACT_NOT_FOUND } = require('./errors');

const getContractById = async (profileId, contractId) => {
  try {
    const contract = await contractsRepository.getContractById(profileId, contractId);

    if (!contract) {
      throw createError(CONTRACT_NOT_FOUND);
    }

    return contract;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

const getNonTerminatedContracts = async (profileId) => {
  try {
    const contracts = await contractsRepository.getNonTerminatedContracts(profileId);

    return contracts;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  getContractById,
  getNonTerminatedContracts,
};

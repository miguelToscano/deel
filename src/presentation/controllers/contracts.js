const contractsService = require('../../application/contracts');

const getContractById = async (req, res, next) => {
  try {
    const contract = await contractsService.getContractById(req.profile.id, req.params.id);
    return res.status(200).json(contract);
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

const getNonTerminatedContracts = async (req, res, next) => {
  try {
    const contracts = await contractsService.getNonTerminatedContracts(req.profile.id);
    return res.status(200).json(contracts);
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

module.exports = {
  getContractById,
  getNonTerminatedContracts,
};

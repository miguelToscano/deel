const balancesService = require('../../application/balances');

const deposit = async (req, res, next) => {
  try {
    await balancesService.deposit(req.profile.id, req.params.userId, req.body.amount);
    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};

module.exports = {
  deposit,
};

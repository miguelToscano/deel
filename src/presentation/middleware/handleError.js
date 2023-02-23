// const { errors, CONTRACT_NOT_FOUND,  } = require('../../application/errors');

const {
  PROFILE_NOT_FOUND, PROFILE_HAS_NOT_ENOUGH_BALANCE, CONTRACT_NOT_FOUND, CONTRACT_NOT_IN_PROGRESS, JOB_NOT_FOUND, JOB_ALREADY_PAID, INTERNAL_SERVER,
} = require('../../application/errors');

const errorMapper = {
  [CONTRACT_NOT_FOUND]: {
    status: 404,
    message: 'Contract not found',
  },
  [CONTRACT_NOT_IN_PROGRESS]: {
    status: 400,
    message: 'Contract not in progress',
  },
  [JOB_NOT_FOUND]: {
    status: 404,
    message: 'Job not found',
  },
  [JOB_ALREADY_PAID]: {
    status: 400,
    message: 'Job already paid',
  },
  [PROFILE_NOT_FOUND]: {
    status: 404,
    message: 'Profile not found',
  },
  [PROFILE_HAS_NOT_ENOUGH_BALANCE]: {
    status: 400,
    message: 'Profile has not enough balance',
  },
  [INTERNAL_SERVER]: {
    status: 500,
    message: 'Internal server error',
  },
};

const mapError = (error) => {
  const { code } = error;
  return errorMapper[code] || errorMapper[INTERNAL_SERVER];
};

/* eslint-disable no-unused-vars */
const handleError = (err, _req, res, _next) => {
  const { status, message } = mapError(err);
  return res.status(status).json({ message });
};

module.exports = { handleError };
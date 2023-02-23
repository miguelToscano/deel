const JOB_NOT_FOUND = 'JOB_NOT_FOUND';
const JOB_ALREADY_PAID = 'JOB_ALREADY_PAID';
const PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND';
const PROFILE_HAS_NOT_ENOUGH_BALANCE = 'PROFILE_HAS_NOT_ENOUGH_BALANCE';
const PROFILE_HAS_TOO_MUCH_DEBT = 'PROFILE_HAS_TOO_MUCH_DEBT';
const CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND';
const CONTRACT_NOT_IN_PROGRESS = 'CONTRACT_NOT_IN_PROGRESS';
const BAD_PARAMS = 'BAD_PARAMS';
const INTERNAL_SERVER = 'INTERNAL_SERVER';

const errors = {
  [JOB_NOT_FOUND]: {
    code: JOB_NOT_FOUND,
    message: 'Job not found',
  },
  [JOB_ALREADY_PAID]: {
    code: JOB_ALREADY_PAID,
    message: 'Job already paid',
  },
  [PROFILE_NOT_FOUND]: {
    code: PROFILE_NOT_FOUND,
    message: 'Profile not found',
  },
  [PROFILE_HAS_NOT_ENOUGH_BALANCE]: {
    code: PROFILE_HAS_NOT_ENOUGH_BALANCE,
    message: 'Profile has not enough balance',
  },
  [PROFILE_HAS_TOO_MUCH_DEBT]: {
    code: PROFILE_HAS_TOO_MUCH_DEBT,
    message: 'Profile has too much debt',

  },
  [CONTRACT_NOT_FOUND]: {
    code: CONTRACT_NOT_FOUND,
    message: 'Contract not found',
  },
  [CONTRACT_NOT_IN_PROGRESS]: {
    code: CONTRACT_NOT_IN_PROGRESS,
    message: 'Contract not in progress',
  },
  [INTERNAL_SERVER]: {
    code: INTERNAL_SERVER,
    message: 'Internal server error',
  },
  [BAD_PARAMS]: {
    code: BAD_PARAMS,
    message: 'Bad params',
  },
};

const DEFAULT_ERROR = INTERNAL_SERVER;

const createError = (errorCode) => {
  const error = new Error();
  error.code = errors[errorCode] ? errors[errorCode].code : errors[DEFAULT_ERROR].code;
  error.message = errors[errorCode] ? errors[errorCode].message : errors[DEFAULT_ERROR].message;
  return error;
};

module.exports = {
  createError,
  JOB_NOT_FOUND,
  JOB_ALREADY_PAID,
  PROFILE_NOT_FOUND,
  PROFILE_HAS_NOT_ENOUGH_BALANCE,
  PROFILE_HAS_TOO_MUCH_DEBT,
  CONTRACT_NOT_FOUND,
  CONTRACT_NOT_IN_PROGRESS,
  BAD_PARAMS,
  INTERNAL_SERVER,
};

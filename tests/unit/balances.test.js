const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { createError, BAD_PARAMS, PROFILE_HAS_TOO_MUCH_DEBT} = require('../../src/application/errors');
const clientProfile = {
    id: 1,
    type: 'client',
    get: (type) => Promise.resolve('client'),
};

const receiverProfile = {
    id: 2,
    type: 'contractor',
    balance: 0,
    get: (balance) => Promise.resolve(0),
};

const sequelize = {
    transaction: () => Promise.resolve({
        LOCK: {
          UPDATE: 'update',
        },
        commit: () => Promise.resolve(),
        rollback: () => Promise.resolve(),
      }),
}

describe('balances service', () => {
    it('should deposit money to the user succesfully', async () => {
        const profilesRepository = {
            getProfileById: (id) => {
                if (id === 1) {
                    return Promise.resolve(clientProfile);
                }
                if (id === 2) {
                    return Promise.resolve(receiverProfile);
                }
            },
            addBalance: (id, amount) => {
                if (id === 2) {
                    receiverProfile.balance = amount;
                }
            }
        }

        const jobsRepository = {
            getUnpaidJobs: () => Promise.resolve([])
        }

        const balancesService = proxyquire('../../src/application/balances', {
            '../infrastructure/repositories/profiles': profilesRepository,
            '../infrastructure/repositories/jobs': jobsRepository,
            '../infrastructure/model': { sequelize }
        });

        await balancesService.deposit(1, 2, 100);

        chai.expect(receiverProfile.balance).to.equal(100);
    });

    it('should fail when depositing 0 amount to a user', async () => {
        const profilesRepository = {
            getProfileById: (id) => {
                if (id === 1) {
                    return Promise.resolve(clientProfile);
                }
                if (id === 2) {
                    return Promise.resolve(receiverProfile);
                }
            },
            addBalance: (id, amount) => {
                if (id === 2) {
                    receiverProfile.balance = amount;
                }
            }
        }

        const jobsRepository = {
            getUnpaidJobs: () => Promise.resolve([])
        }

        const balancesService = proxyquire('../../src/application/balances', {
            '../infrastructure/repositories/profiles': profilesRepository,
            '../infrastructure/repositories/jobs': jobsRepository,
            '../infrastructure/model': { sequelize }
        });

        const expectedError = createError(BAD_PARAMS);

        try {
            await balancesService.deposit(1, 2, 0);
        } catch (error) {
            chai.expect(error.message).to.equal(expectedError.message);
            chai.expect(error.code).to.equal(expectedError.code);
        }
    });

    it('should fail when depositing more than 25% of the total debt', async () => {
        const profilesRepository = {
            getProfileById: (id) => {
                if (id === 1) {
                    return Promise.resolve(clientProfile);
                }
                if (id === 2) {
                    return Promise.resolve(receiverProfile);
                }
            },
            addBalance: (id, amount) => {
                if (id === 2) {
                    receiverProfile.balance = amount;
                }
            }
        }

        const jobsRepository = {
            getUnpaidJobs: () => Promise.resolve([
                {
                    get: (price) => Promise.resolve(100)
                }
            ])
        }

        const balancesService = proxyquire('../../src/application/balances', {
            '../infrastructure/repositories/profiles': profilesRepository,
            '../infrastructure/repositories/jobs': jobsRepository,
            '../infrastructure/model': { sequelize }
        });

        const expectedError = createError(PROFILE_HAS_TOO_MUCH_DEBT);

        try {
            await balancesService.deposit(1, 2, 100);
        } catch (error) {
            chai.expect(error.message).to.equal(expectedError.message);
            chai.expect(error.code).to.equal(expectedError.code);
        }
    });
});
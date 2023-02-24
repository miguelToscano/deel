// const chai = require('chai');
// const sinon = require('sinon');
// const proxyquire = require('proxyquire');
// const { createError, BAD_PARAMS, PROFILE_HAS_TOO_MUCH_DEBT} = require('../../src/application/errors');

// describe('jobs service', async () => {
//     it('Should mark job as paid succesfully', async () => {
//         const job = {
//             id: 1,
//             paid: false,
//             save: () => Promise.resolve(),
//         }
//         const jobsRepository = {
//             getJobById: (id) => Promise.resolve(job),
//         }
//         const jobsService = proxyquire('../../src/application/jobs', {
//             '../infrastructure/repositories/jobs': jobsRepository,
//         });

//         await jobsService.payJob(1);

//         chai.expect(job.paid).to.equal(true);
//     });
// });
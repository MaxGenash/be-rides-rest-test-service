import RidesRepo from '../RidesRepo';
import { initDB } from '../../../common/db/sqlLiteDriver';
import { DBDriver } from '../../../common/db/types';

let db: DBDriver;
let ridesRepo: RidesRepo;

describe('RidesRepo integration tests', () => {
    beforeAll(async () => {
        db = await initDB();
        ridesRepo = new RidesRepo(db);
    });

    describe('findOne method', () => {
        it('should not have SQL injection vulnerabilities', async () => {
            const injection = "1' boom"; // If there is a vulnerability the query will throw an error

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await ridesRepo.findOne({ filters: { rideID: injection as any } });

            expect(res).toBeUndefined();
        });
    });
});

import { promisify } from 'util';
import { DBDriver } from '../../common/db/types';

export default class RidesRepo {
    constructor(private db: DBDriver) {}

    async clear() {
        return promisify(this.db.run.bind(this.db))(`DELETE FROM Rides`);
    }
}

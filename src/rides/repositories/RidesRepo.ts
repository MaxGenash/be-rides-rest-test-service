import { promisify } from 'util';
import { DBDriver } from '../../common/db/types';
import RideRecord, { NewRideRecord } from '../types/RideRecord';

interface QueryParams {
    filters: {
        rideID: number;
    };
}

// TODO (Future): use proper ORM
export default class RidesRepo {
    constructor(private db: DBDriver) {}

    /**
     * Inserts a new record. Returns the id of the created record
     */
    async create(rec: NewRideRecord): Promise<number> {
        const { startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle } = rec;
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle],
                function insertCallback(err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(this.lastID);
                },
            );
        });
    }

    async findOne({ filters }: QueryParams): Promise<RideRecord> {
        // TODO (Future): add more filters when needed
        return promisify<string, RideRecord>(this.db.get.bind(this.db))(
            `SELECT * FROM Rides WHERE rideID='${filters.rideID}'`,
        );
    }

    async findMany(): Promise<RideRecord[]> {
        // TODO (Future): add filters when needed
        return promisify<string, RideRecord[]>(this.db.all.bind(this.db))('SELECT * FROM Rides');
    }

    /**
     * Clears all ride records in the DB
     */
    async clear() {
        return promisify(this.db.run.bind(this.db))(`DELETE FROM Rides`);
    }
}

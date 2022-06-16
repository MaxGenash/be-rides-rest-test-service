import RidesRepo from '../repositories/RidesRepo';
import RideEntity, { NewRideEntity } from '../types/RideEntity';

export default class RidesService {
    constructor(private ridesRepo: RidesRepo) {}

    async create(ride: NewRideEntity) {
        const createdId = await this.ridesRepo.create(ride);
        return this.getRideById(createdId);
    }

    async getRideById(id: number): Promise<RideEntity> {
        return this.ridesRepo.findOne({ filters: { rideID: id } });
    }

    async getAllRides(): Promise<RideEntity[]> {
        return this.ridesRepo.findMany();
    }
}

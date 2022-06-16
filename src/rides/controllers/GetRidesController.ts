import express from 'express';
import RidesService from '../services/RidesService';
import RidesMapper from '../mappers/RidesMapper';
import type { Logger } from '../../common/logger';

export default class GetRidesController {
    constructor(
        private logger: Logger,
        private ridesService: RidesService,
        private ridesMapper: RidesMapper,
    ) {}

    async run(req: express.Request, res: express.Response) {
        // TODO (Future): handle try/catch in the base controller
        try {
            const rides = await this.ridesService.getAllRides();
            if (rides.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }
            return res.send(rides.map(this.ridesMapper.mapEntityToResDTO));
        } catch (error) {
            this.logger.error('Failed to find Rides records:', error);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }
    }
}

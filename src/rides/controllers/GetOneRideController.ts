import express from 'express';
import RidesService from '../services/RidesService';
import RidesMapper from '../mappers/RidesMapper';
import type { Logger } from '../../common/logger';

export default class GetOneRideController {
    constructor(
        private logger: Logger,
        private ridesService: RidesService,
        private ridesMapper: RidesMapper,
    ) {}

    async run(req: express.Request, res: express.Response) {
        // TODO (Future): handle try/catch in the base controller
        try {
            const ride = await this.ridesService.getRideById(Number(req.params.id));
            if (!ride) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }
            return res.send([this.ridesMapper.mapEntityToResDTO(ride)]);
        } catch (error) {
            this.logger.error('Failed to find a ride record by id:', error);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }
    }
}

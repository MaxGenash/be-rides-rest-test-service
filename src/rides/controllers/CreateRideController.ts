import express from 'express';
import RidesService from '../services/RidesService';
import RidesMapper from '../mappers/RidesMapper';
import RideReqDTO from '../types/RideReqDTO';
import validateNewRide from './validators/validateNewRide';
import type { Logger } from '../../common/logger';

export default class CreateRideController {
    constructor(
        private logger: Logger,
        private ridesService: RidesService,
        private ridesMapper: RidesMapper,
    ) {}

    async run(req: express.Request, res: express.Response) {
        const rideReqDTO = req.body as RideReqDTO;
        const rideEntity = this.ridesMapper.mapReqDTOToEntity(rideReqDTO);

        // TODO (Future): consider using express-validator
        const validationError = validateNewRide(rideEntity);
        if (validationError) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: validationError,
            });
        }

        // TODO (Future): handle try/catch in the base controller
        try {
            const createdRide = await this.ridesService.create(rideEntity);
            return res.send([this.ridesMapper.mapEntityToResDTO(createdRide)]);
        } catch (error) {
            this.logger.error('Failed to insert a Rides record:', error);
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        }
    }
}

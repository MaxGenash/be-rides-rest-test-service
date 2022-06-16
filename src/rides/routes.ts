import express from 'express';
import bodyParser from 'body-parser';
import { DBDriver } from '../common/db/types';
import { Logger } from '../common/logger';
import RidesService from './services/RidesService';
import RidesRepo from './repositories/RidesRepo';
import RidesMapper from './mappers/RidesMapper';
import CreateRideController from './controllers/CreateRideController';
import GetOneRideController from './controllers/GetOneRideController';
import GetRidesController from './controllers/GetRidesController';

const jsonParser = bodyParser.json();

export default (db: DBDriver, logger: Logger) => {
    // TODO (Future): use Dependency Injection container instead of creating all the instances each time manually
    const ridesRepo = new RidesRepo(db);
    const ridesService = new RidesService(ridesRepo);
    const ridesMapper = new RidesMapper();
    const createRideController = new CreateRideController(logger, ridesService, ridesMapper);
    const getRidesController = new GetRidesController(logger, ridesService, ridesMapper);
    const getOneRideController = new GetOneRideController(logger, ridesService, ridesMapper);
    const router = express.Router({ mergeParams: true });

    router.post('/rides', jsonParser, createRideController.run.bind(createRideController));

    router.get('/rides', getRidesController.run.bind(getRidesController));

    router.get('/rides/:id', getOneRideController.run.bind(getOneRideController));

    return router;
};

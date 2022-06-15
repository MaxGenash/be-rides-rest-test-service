import request from 'supertest';
import createApp from '../app';
import { db, initDB } from '../common/db/sqlLiteDriver';
import { generateRideReqDTO } from './helpers/factories/rides';
import RidesRepo from '../rides/repositories/RidesRepo';
import RidesMapper from '../rides/mappers/RidesMapper';
import loggerMock from '../common/logger';

jest.mock('../common/logger');

const app = createApp(db, loggerMock);
const ridesRepo = new RidesRepo(db);
const ridesMapper = new RidesMapper();

describe('API tests', () => {
    beforeAll(async () => {
        await initDB();
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        jest.restoreAllMocks();
    });

    describe('GET /api-docs', () => {
        it('should return HTML with API docs', async () => {
            const res = await request(app).get('/api-docs/');

            expect(res.headers['content-type']).toContain('text/html');
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('swagger');
        });
    });

    describe('GET /health', () => {
        it('should return health', async () => {
            const res = await request(app).get('/health');

            expect(res.headers['content-type']).toContain('text');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('Not existing routes', () => {
        it('GET should return NOT_FOUND error with status 404', async () => {
            const res = await request(app).get('/some_not_existing_route');

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                error_code: 'NOT_FOUND',
            });
        });

        it('POST should return NOT_FOUND error with status 404', async () => {
            const res = await request(app).post('/some_not_existing_route');

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                error_code: 'NOT_FOUND',
            });
        });

        it('PUT should return NOT_FOUND error with status 404', async () => {
            const res = await request(app).put('/some_not_existing_route');

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                error_code: 'NOT_FOUND',
            });
        });

        it('DELETE should return NOT_FOUND error with status 404', async () => {
            const res = await request(app).delete('/some_not_existing_route');

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(404);
            expect(res.body).toMatchObject({
                error_code: 'NOT_FOUND',
            });
        });
    });

    describe('POST /rides', () => {
        it('should return VALIDATION_ERROR when a coordinate is out of range', async () => {
            const rideReqDTOWithWrongLat = generateRideReqDTO({
                start_lat: 1000,
            });

            const res = await request(app).post('/rides').send(rideReqDTOWithWrongLat);

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'VALIDATION_ERROR',
            });
        });

        it('should return SERVER_ERROR when there is an internal error when performing the request', async () => {
            const rideReqDTO = generateRideReqDTO();

            const dbRunStub = jest
                .spyOn(db, 'run')
                .mockImplementation((sql, values, cb) => cb(new Error('Something is Wrong')));

            const res = await request(app).post('/rides').send(rideReqDTO);

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'SERVER_ERROR',
            });

            dbRunStub.mockRestore();
        });

        it('should return the created records when the payload is valid and no DB errors', async () => {
            const rideReqDTO = generateRideReqDTO();
            const expectedPartialResDTO = ridesMapper.mapEntityToResDTO(
                ridesMapper.mapReqDTOToEntity(rideReqDTO),
            );

            const res = await request(app).post('/rides').send(rideReqDTO);

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject([
                {
                    ...expectedPartialResDTO,
                    rideID: expect.any(Number),
                    created: expect.any(String),
                },
            ]);
        });
    });

    describe('GET /rides', () => {
        it('should return RIDES_NOT_FOUND_ERROR when there are no rides', async () => {
            // TODO (Future): clear the data using API when we add DELETE endpoint, so that we
            //  won't need to update the test when the endpoint implementation changes
            await ridesRepo.clear();

            const res = await request(app).get('/rides').send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'RIDES_NOT_FOUND_ERROR',
            });
        });

        it('should return SERVER_ERROR when there is an internal error when performing the request', async () => {
            const dbAllStub = jest
                .spyOn(db, 'all')
                .mockImplementation((sql, cb) => cb(new Error('Something is Wrong')));

            const res = await request(app).get('/rides').send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'SERVER_ERROR',
            });

            dbAllStub.mockRestore();
        });

        it('should return all the Rides when they are present', async () => {
            const rideItemsCount = 2;
            const rideReqDTOs = Array.from(new Array(rideItemsCount)).map(() =>
                generateRideReqDTO(),
            );

            // TODO (Future): clear the data using API when we add DELETE endpoint, so that we
            //  won't need to update the test when the endpoint implementation changes
            await ridesRepo.clear();
            await Promise.all(
                rideReqDTOs.map((rideReqDTO) => request(app).post('/rides').send(rideReqDTO)),
            );

            const res = await request(app).get('/rides').send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(rideItemsCount);
            for (const rideReqDTO of rideReqDTOs) {
                const expectedPartialResDTO = ridesMapper.mapEntityToResDTO(
                    ridesMapper.mapReqDTOToEntity(rideReqDTO),
                );
                expect(res.body).toContainEqual({
                    ...expectedPartialResDTO,
                    rideID: expect.any(Number),
                    created: expect.any(String),
                });
            }
        });
    });

    describe('GET /rides/:id', () => {
        it('should return RIDES_NOT_FOUND_ERROR when there are no matching rides', async () => {
            const res = await request(app).get('/rides/some_non_existing_id').send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'RIDES_NOT_FOUND_ERROR',
            });
        });

        it('should return SERVER_ERROR when there is an internal error when performing the request', async () => {
            const dbAllStub = jest
                .spyOn(db, 'all')
                .mockImplementation((sql, cb) => cb(new Error('Something is Wrong')));

            const res = await request(app).get('/rides/1').send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                error_code: 'SERVER_ERROR',
            });

            dbAllStub.mockRestore();
        });

        it('should return the Ride when it is found', async () => {
            const rideReqDTO = generateRideReqDTO();
            const expectedPartialResDTO = ridesMapper.mapEntityToResDTO(
                ridesMapper.mapReqDTOToEntity(rideReqDTO),
            );
            // We prepare the data using API instead of raw DB so that if the endpoint implementation
            // changes (e.g. we start collecting the data for this endpoint from 2 different sources)
            // we will not need update the API tests
            const createdRideRes = await request(app).post('/rides').send(rideReqDTO);
            const createdRideId = createdRideRes.body[0].rideID;

            const res = await request(app).get(`/rides/${createdRideId}`).send();

            expect(res.headers['content-type']).toContain('json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject([
                {
                    ...expectedPartialResDTO,
                    rideID: createdRideId,
                    created: expect.any(String),
                },
            ]);
        });
    });
});

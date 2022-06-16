import type { Express } from 'express';
import request from 'supertest';
import createApp from '../../app';
import { initDB } from '../../common/db/sqlLiteDriver';
import loggerMock from '../../common/logger';
import type { DBDriver } from '../../common/db/types';

jest.mock('../../common/logger');

let db: DBDriver;
let app: Express;

describe('Common API tests', () => {
    beforeAll(async () => {
        db = await initDB();
        app = createApp(db, loggerMock);
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
});

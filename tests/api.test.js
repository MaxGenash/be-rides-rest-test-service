const { promisify } = require('util');
const request = require('supertest');
const sqlite3 = require('sqlite3');
const createApp = require('../src/app');
const buildSchemas = require('../src/schemas');

const db = new (sqlite3.verbose().Database)(':memory:');
const app = createApp(db);

describe('API tests', () => {
    beforeAll(async () => {
        await promisify(db.serialize.bind(db))();
        buildSchemas(db);
    });

    describe('GET /health', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should return health', async () => {
            await request(app).get('/health').expect('Content-Type', /text/).expect(200);
        });
    });
});

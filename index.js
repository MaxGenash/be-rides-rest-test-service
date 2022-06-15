const sqlite3 = require('sqlite3').verbose();
const buildSchemas = require('./src/schemas');
const app = require('./src/app');
const logger = require('./src/common/logger');

const port = 8010;
const db = new sqlite3.Database(':memory:');

db.serialize(async () => {
    await buildSchemas(db);
    app(db).listen(port, () => logger.info(`App started and listening on port ${port}`));
});

process.on('uncaughtException', (error) => {
    logger.error(`Unhandled Exception:`, error);
});
process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection:`, error);
});

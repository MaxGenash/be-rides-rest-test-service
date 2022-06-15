import sqlite3 from 'sqlite3';
import buildSchemas from './schemas';
import createApp from './app';
import logger from './common/logger';

const port = 8010;
const db = new (sqlite3.verbose().Database)(':memory:');

db.serialize(async () => {
    await buildSchemas(db);
    createApp(db, logger).listen(port, () =>
        logger.info(`App started and listening on port ${port}`),
    );
});

process.on('uncaughtException', (error) => {
    logger.error(`Unhandled Exception:`, error);
});
process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection:`, error);
});

import createApp from './app';
import { initDB } from './common/db/sqlLiteDriver';
import logger from './common/logger';

const port = 8010;

async function run() {
    const db = await initDB();
    const app = createApp(db, logger);
    app.listen(port, () => logger.info(`App started and listening on port ${port}`));
}
run().catch((error) => logger.error(`Failed to run the server:`, error));

process.on('uncaughtException', (error) => {
    logger.error(`Unhandled Exception:`, error);
});
process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection:`, error);
});

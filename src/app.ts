import express from 'express';
import expressWinston from 'express-winston';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api-docs/v1/openapi.json';
import { isDevEnv } from './utils/envUtils';
import type { Logger } from './common/logger';
import { DBDriver } from './common/db/types';
import ridesRouter from './rides/routes';

const app = express();

export default function createApp(db: DBDriver, logger: Logger) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(
        expressWinston.logger({
            meta: isDevEnv,
            winstonInstance: logger,
            statusLevels: true,
            expressFormat: true,
        }),
    );

    app.get('/health', (req, res) => res.send('Healthy'));

    app.use(ridesRouter(db, logger));

    app.use((req, res) => {
        res.status(404).send({
            error_code: 'NOT_FOUND',
            message: 'Not found',
        });
    });

    app.use(
        expressWinston.errorLogger({
            winstonInstance: logger,
            meta: true,
        }),
    );

    // eslint-disable-next-line no-unused-vars
    app.use(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
        (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.error('Unhandled middleware error:', error);
            // TODO (Future): return status 500. Now we return 200 for backwards compatibility
            res.status(200);
            res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error',
            });
        },
    );

    return app;
}

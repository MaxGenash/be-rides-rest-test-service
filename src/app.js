const express = require('express');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/v1/openapi.json');
const { isDevEnv } = require('./utils/envUtils');

const app = express();
const jsonParser = bodyParser.json();

module.exports = (db, logger) => {
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

    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (
            startLatitude < -90 ||
            startLatitude > 90 ||
            startLongitude < -180 ||
            startLongitude > 180
        ) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message:
                    'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message:
                    'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        const values = [
            req.body.start_lat,
            req.body.start_long,
            req.body.end_lat,
            req.body.end_long,
            req.body.rider_name,
            req.body.driver_name,
            req.body.driver_vehicle,
        ];

        return db.run(
            'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
            values,
            function insertCallback(insertErr) {
                if (insertErr) {
                    logger.error('Failed to insert a Rides record:', insertErr);
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error',
                    });
                }

                return db.all(
                    'SELECT * FROM Rides WHERE rideID = ?',
                    this.lastID,
                    (findLastResultErr, rows) => {
                        if (findLastResultErr) {
                            logger.error(
                                'Failed to retrieve a created Ride record:',
                                findLastResultErr,
                            );
                            return res.send({
                                error_code: 'SERVER_ERROR',
                                message: 'Unknown error',
                            });
                        }

                        return res.send(rows);
                    },
                );
            },
        );
    });

    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', (error, rows) => {
            if (error) {
                logger.error('Failed to find Rides records:', error);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            return res.send(rows);
        });
    });

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, (error, rows) => {
            if (error) {
                logger.error('Failed to insert a ride record to DB:', error);
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            return res.send(rows);
        });
    });

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
            statusLevels: true,
            expressFormat: true,
        }),
    );

    // eslint-disable-next-line no-unused-vars
    app.use((error, req, res, next) => {
        logger.error('Unhandled middleware error:', error);
        res.status(error.status || 500);
        res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
        });
    });

    return app;
};

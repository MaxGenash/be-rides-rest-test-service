const winston = require('winston');
const { isDevEnv } = require('../utils/envUtils');

const getLogLevel = () => {
    return isDevEnv ? 'debug' : 'warn';
};

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.json({
        space: isDevEnv ? 2 : undefined,
    }),
);

const transports = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
    new winston.transports.File({
        format: fileFormat,
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({
        format: fileFormat,
        filename: 'logs/all.log',
    }),
];

const logger = winston.createLogger({
    level: getLogLevel(),
    transports,
});

module.exports = logger;

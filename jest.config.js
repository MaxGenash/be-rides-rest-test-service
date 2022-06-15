// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    collectCoverage: false,
    collectCoverageFrom: [
        './src/**/*.{ts,js}',
        '!**/node_modules/**',
        '!**/__tests__/**',
        '!./src/index.ts',
    ],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[tj]s'],
    testPathIgnorePatterns: ['build/', 'coverage/', 'node_modules/', 'src(/__tests__/helpers)'],
};

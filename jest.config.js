// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    collectCoverage: false,
    collectCoverageFrom: ['./src/**/*.js'],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    moduleFileExtensions: ['js', 'json', 'node'],
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.[jt]s', '**/?(*.)+(spec|test).[tj]s'],
};

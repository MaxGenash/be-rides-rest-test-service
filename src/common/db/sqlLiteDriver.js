const { promisify } = require('util');
const sqlite3 = require('sqlite3').verbose();
const buildSchemas = require('../../schemas');

const db = new sqlite3.Database(':memory:');

async function initDB() {
    await promisify(db.serialize.bind(db))();
    await buildSchemas(db);
    return db;
}

module.exports = {
    initDB,
    db,
};

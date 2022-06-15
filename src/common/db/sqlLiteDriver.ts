import { promisify } from 'util';
import sqlite3 from 'sqlite3';
import buildSchemas from '../../schemas';

export const db = new (sqlite3.verbose().Database)(':memory:');

export async function initDB() {
    await promisify(db.serialize.bind(db))();
    await buildSchemas(db);
    return db;
}

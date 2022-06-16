/* eslint-disable import/prefer-default-export */
import { promisify } from 'util';
import sqlite3 from 'sqlite3';
import buildSchemas from './schemas';
import { DBDriver } from './types';

const db = new (sqlite3.verbose().Database)(':memory:');

export async function initDB(): Promise<DBDriver> {
    await promisify(db.serialize.bind(db))();
    await buildSchemas(db);
    return db;
}

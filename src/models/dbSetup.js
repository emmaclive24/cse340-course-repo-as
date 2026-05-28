import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Checks whether the database tables exist and creates + seeds them if not.
 * Runs once at server startup so the app works without manual SQL execution.
 */
const initializeDatabase = async () => {
    try {
        const checkResult = await db.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'service_project'
            ) AS exists;
        `);

        if (checkResult.rows[0].exists) {
            console.log('Database tables already exist — skipping setup.');
            return;
        }

        console.log('Tables not found — running setup.sql...');
        const setupSQL = readFileSync(
            path.join(__dirname, '../setup.sql'),
            'utf8'
        );
        await db.query(setupSQL);
        console.log('Database initialised successfully.');
    } catch (error) {
        console.error('Database initialisation error:', error.message);
        throw error;
    }
};

export { initializeDatabase };

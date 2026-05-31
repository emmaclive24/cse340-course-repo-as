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

        if (!checkResult.rows[0].exists) {
            console.log('Tables not found — running setup.sql...');
            const setupSQL = readFileSync(
                path.join(__dirname, '../setup.sql'),
                'utf8'
            );
            await db.query(setupSQL);
            console.log('Database initialised successfully.');
        } else {
            console.log('Core tables exist — checking auth tables...');
        }

        // Always ensure roles and users tables exist (idempotent)
        await db.query(`
            CREATE TABLE IF NOT EXISTS roles (
                role_id SERIAL PRIMARY KEY,
                role_name VARCHAR(50) UNIQUE NOT NULL,
                role_description TEXT
            );
        `);

        await db.query(`
            INSERT INTO roles (role_name, role_description)
            VALUES
                ('user',  'Standard user with basic access'),
                ('admin', 'Administrator with full system access')
            ON CONFLICT (role_name) DO NOTHING;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id       SERIAL PRIMARY KEY,
                name          VARCHAR(100)  NOT NULL,
                email         VARCHAR(100)  UNIQUE NOT NULL,
                password_hash VARCHAR(255)  NOT NULL,
                role_id       INTEGER REFERENCES roles(role_id),
                created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Auth tables ready.');
    } catch (error) {
        console.error('Database initialisation error:', error.message);
        throw error;
    }
};

export { initializeDatabase };

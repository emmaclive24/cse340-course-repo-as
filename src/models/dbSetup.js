import { readFileSync } from 'fs'; 
import { fileURLToPath } from 'url'; 
import path from 'path'; 
import db from './db.js'; 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

/** 
 * Initialises the database at server startup.
 * 
 * Strategy (all steps are idempotent — safe to run on every restart):
 * 1. Create roles + users tables (needed before setup.sql inserts may reference them)
 * 2. Seed the two default roles
 * 3. Run setup.sql which creates organization / service_project / category / project_category
 * with IF NOT EXISTS guards so re-running is harmless
 */ 
const initializeDatabase = async () => { 
  try { 
    // ── Step 1: Auth tables first (other tables may reference them) ──────── 
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
        ('user', 'Standard user with basic access'), 
        ('admin', 'Administrator with full system access') 
      ON CONFLICT (role_name) DO NOTHING; 
    `); 

    await db.query(` 
      CREATE TABLE IF NOT EXISTS users ( 
        user_id SERIAL PRIMARY KEY, 
        name VARCHAR(100) NOT NULL, 
        email VARCHAR(100) UNIQUE NOT NULL, 
        password_hash VARCHAR(255) NOT NULL, 
        role_id INTEGER REFERENCES roles(role_id), 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      ); 
    `); 
    console.log('Auth tables ready.'); 

    // ── Step 2: Application tables (setup.sql uses IF NOT EXISTS) ────────── 
    const setupSQL = readFileSync( 
      path.join(__dirname, '../setup.sql'), 
      'utf8' 
    ); 
    await db.query(setupSQL); 
    console.log('Application tables ready.'); 

  } catch (error) { 
    console.error('Database initialisation error:', error.message); 
    throw error; 
  } 
}; 

export { initializeDatabase };

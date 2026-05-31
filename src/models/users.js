import bcrypt from 'bcrypt';
import db from './db.js';

/**
 * Inserts a new user into the database with a hashed password.
 * Assigns the new user to the default "user" role.
 */
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'user'))
        RETURNING user_id, name, email
    `;
    const result = await db.query(query, [name, email, passwordHash]);
    return result.rows[0];
};

/**
 * Finds a user by email address, joining with the roles table
 * so that role_name is included in the returned object.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email and password.
 * Returns the user object (without password_hash) on success, or null on failure.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) return null;

    // Remove password_hash before returning
    const { password_hash, ...safeUser } = user;
    return safeUser;
};

/**
 * Returns all registered users with their role names.
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.created_at ASC
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, authenticateUser, getAllUsers };

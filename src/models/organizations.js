import db from './db.js';

// Retrieve all organizations
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Retrieve a single organization by its ID
const getOrganizationById = async (organizationId) => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @param {string} logoFilename
 * @returns {number} The ID of the newly created organization
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id
    `;
    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }
    return result.rows[0].organization_id;
};

/**
 * Updates an existing organization in the database.
 * @param {number} id
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @param {string} logoFilename
 */
const updateOrganization = async (id, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE organization
        SET name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
    `;
    await db.query(query, [name, description, contactEmail, logoFilename, id]);
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated organization with ID:', id);
    }
};

export { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization };

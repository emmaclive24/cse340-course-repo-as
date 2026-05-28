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

export { getAllOrganizations, getOrganizationById };

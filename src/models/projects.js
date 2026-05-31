import db from './db.js';

// Retrieve all service projects with their organization name
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Retrieve the next 5 upcoming service projects with their organization name
const getUpcomingProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT 5;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Retrieve a single service project by its ID with the organization name
const getProjectById = async (projectId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all service projects belonging to a specific organization
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, title, description, location, date, organization_id
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date ASC;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

// Retrieve all service projects belonging to a specific category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id
        FROM service_project p
        INNER JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

/**
 * Creates a new service project in the database.
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {string} date
 * @param {number} organizationId
 * @returns {number} The ID of the newly created project
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO service_project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;
    const result = await db.query(query, [title, description, location, date, organizationId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }
    return result.rows[0].project_id;
};

/**
 * Updates an existing service project in the database.
 * @param {number} id
 * @param {string} title
 * @param {string} description
 * @param {string} location
 * @param {string} date
 * @param {number} organizationId
 */
const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_project
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
    `;
    await db.query(query, [title, description, location, date, organizationId, id]);
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', id);
    }
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectById,
    getProjectsByOrganizationId,
    getProjectsByCategoryId,
    createProject,
    updateProject
};

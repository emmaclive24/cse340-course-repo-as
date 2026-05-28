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

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectById,
    getProjectsByOrganizationId,
    getProjectsByCategoryId
};

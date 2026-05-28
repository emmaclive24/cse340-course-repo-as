import db from './db.js';

// Retrieve all categories
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Retrieve a single category by its ID
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all categories assigned to a given service project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        INNER JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId };

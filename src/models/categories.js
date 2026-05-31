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

/**
 * Assigns a single category to a project in the many-to-many table.
 * (Not exported — used internally by updateCategoryAssignments.)
 */
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `;
    await db.query(query, [projectId, categoryId]);
};

/**
 * Replaces all category assignments for a project.
 * Deletes existing assignments then inserts the new set.
 * @param {number} projectId
 * @param {number[]} categoryIds - Array of category IDs to assign
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove all existing assignments for this project
    await db.query('DELETE FROM project_category WHERE project_id = $1', [projectId]);

    // Insert new assignments
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(projectId, categoryId);
        }
    }
};

export { getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignments };

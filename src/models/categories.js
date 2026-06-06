import db from './db.js'; 

// ─── Read ────────────────────────────────────────────────────────────────────── 
// Retrieve all categories 
const getAllCategories = async () => { 
  const query = ` 
    SELECT category_id, name 
    FROM categories 
    ORDER BY name ASC; 
  `; 
  const result = await db.query(query); 
  return result.rows; 
}; 

// Retrieve a single category by its ID 
const getCategoryById = async (categoryId) => { 
  const query = ` 
    SELECT category_id, name 
    FROM categories 
    WHERE category_id = $1; 
  `; 
  const result = await db.query(query, [categoryId]); 
  return result.rows.length > 0 ? result.rows[0] : null; 
}; 

// Retrieve all categories assigned to a given service project 
const getCategoriesByProjectId = async (projectId) => { 
  const query = ` 
    SELECT c.category_id, c.name 
    FROM categories c 
    INNER JOIN project_category pc ON c.category_id = pc.category_id 
    WHERE pc.project_id = $1 
    ORDER BY c.name ASC; 
  `; 
  const result = await db.query(query, [projectId]); 
  return result.rows; 
}; 

// ─── Create ──────────────────────────────────────────────────────────────────── 
/** 
 * Inserts a new category into the database. 
 * @param {string} name - The category name. 
 * @returns {number} The ID of the newly created category. 
 */ 
const createCategory = async (name) => { 
  const query = ` 
    INSERT INTO categories (name) 
    VALUES ($1) 
    RETURNING category_id 
  `; 
  const result = await db.query(query, [name]); 
  if (result.rows.length === 0) { 
    throw new Error('Failed to create category'); 
  } 
  if (process.env.ENABLE_SQL_LOGGING === 'true') { 
    console.log('Created new category with ID:', result.rows[0].category_id); 
  } 
  return result.rows[0].category_id; 
}; 

// ─── Update ──────────────────────────────────────────────────────────────────── 
/** 
 * Updates an existing category in the database. 
 * @param {number} categoryId 
 * @param {string} name 
 */ 
const updateCategory = async (categoryId, name) => { 
  const query = ` 
    UPDATE categories 
    SET name = $1 
    WHERE category_id = $2 
    RETURNING category_id 
  `; 
  const result = await db.query(query, [name, categoryId]); 
  if (result.rows.length === 0) { 
    throw new Error('Category not found'); 
  } 
  if (process.env.ENABLE_SQL_LOGGING === 'true') { 
    console.log('Updated category with ID:', categoryId); 
  } 
  return result.rows[0].category_id; 
}; 

// ─── Assign categories ───────────────────────────────────────────────────────── 
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
 * @param {number[]} categoryIds 
 */ 
const updateCategoryAssignments = async (projectId, categoryIds) => { 
  await db.query('DELETE FROM project_category WHERE project_id = $1', [projectId]); 
  if (Array.isArray(categoryIds) && categoryIds.length > 0) { 
    for (const categoryId of categoryIds) { 
      await assignCategoryToProject(projectId, categoryId); 
    } 
  } 
}; 

export { 
  getAllCategories, 
  getCategoryById, 
  getCategoriesByProjectId, 
  createCategory, 
  updateCategory, 
  updateCategoryAssignments 
};

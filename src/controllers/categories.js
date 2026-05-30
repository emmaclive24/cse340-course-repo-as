import { getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { getProjectById } from '../models/projects.js';

// Display the list of all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Service Categories', categories });
    } catch (error) {
        next(error);
    }
};

// Display the details page for a single category
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// GET /project/:projectId/assign-categories — show the assign-categories form
const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const project = await getProjectById(projectId);
        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const allCategories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            project,
            allCategories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

// POST /project/:projectId/assign-categories — process the category assignment
const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // categories may be undefined (none selected), a string (one), or an array (many)
        let categoryIds = req.body.categories || [];
        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }
        // Convert to integers
        categoryIds = categoryIds.map(Number).filter(Boolean);

        await updateCategoryAssignments(projectId, categoryIds);
        req.flash('success', 'Categories updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};

import { body, validationResult } from 'express-validator';
import { 
  getAllCategories, 
  getCategoryById, 
  getCategoriesByProjectId, 
  createCategory, 
  updateCategory, 
  updateCategoryAssignments 
} from '../models/categories.js'; 
import { getProjectsByCategoryId, getProjectById } from '../models/projects.js'; 

// ─── Validation rules ──────────────────────────────────────────────────────────
/**
 * Server-side validation for the category name.
 * NOTE: minlength (3) is intentionally NOT added to the client-side HTML so
 * that server-side validation can be demonstrated independently.
 */
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

// ─── Categories list ───────────────────────────────────────────────────────────
const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Service Categories', categories });
  } catch (error) {
    next(error);
  }
};

// ─── Category details ──────────────────────────────────────────────────────────
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
    res.render('category', { title: category.name, category, projects });
  } catch (error) {
    next(error);
  }
};

// ─── Create new category ───────────────────────────────────────────────────────
const showNewCategoryForm = (req, res) => {
  res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash('error', error.msg);
      });
      return res.redirect('/new-category');
    }
    const { name } = req.body;
    await createCategory(name);
    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');
  } catch (error) {
    if (error.code === '23505') {
      req.flash('error', 'A category with that name already exists.');
      return res.redirect('/new-category');
    }
    next(error);
  }
};

// ─── Edit existing category ────────────────────────────────────────────────────
const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-category', { title: 'Edit Category', category });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((error) => {
        req.flash('error', error.msg);
      });
      return res.redirect(`/edit-category/${categoryId}`);
    }
    const { name } = req.body;
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
  } catch (error) {
    if (error.code === '23505') {
      req.flash('error', 'A category with that name already exists.');
      return res.redirect(`/edit-category/${req.params.id}`);
    }
    next(error);
  }
};

// ─── Assign categories to project ──────────────────────────────────────────────
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
    res.render('assign-categories', { title: 'Assign Categories to Project', project, allCategories, assignedCategories });
  } catch (error) {
    next(error);
  }
};

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    let categoryIds = req.body.categories || [];
    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }
    categoryIds = categoryIds.map(Number).filter(Boolean);
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export { 
  categoryValidation, 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showNewCategoryForm, 
  processNewCategoryForm, 
  showEditCategoryForm, 
  processEditCategoryForm,
  showAssignCategoriesForm, 
  processAssignCategoriesForm 
};

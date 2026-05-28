import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showServicesPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects (upcoming) and Services (all)
router.get('/projects', showProjectsPage);
router.get('/services', showServicesPage);
router.get('/project/:id', showProjectDetailsPage);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Development error test
router.get('/test-error', testErrorPage);

export default router;

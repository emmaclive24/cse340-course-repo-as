import express from 'express'; 
import { showHomePage } from './controllers/index.js'; 
import { 
  showOrganizationsPage, 
  showOrganizationDetailsPage, 
  showNewOrganizationForm, 
  processNewOrganizationForm, 
  showEditOrganizationForm, 
  processEditOrganizationForm, 
  organizationValidation 
} from './controllers/organizations.js'; 
import { 
  showProjectsPage, 
  showServicesPage, 
  showProjectDetailsPage, 
  showNewProjectForm, 
  processNewProjectForm, 
  showEditProjectForm, 
  processEditProjectForm, 
  projectValidation 
} from './controllers/projects.js'; 
import { 
  categoryValidation, 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showNewCategoryForm, 
  processNewCategoryForm, 
  showEditCategoryForm, 
  processEditCategoryForm, 
  showAssignCategoriesForm, 
  processAssignCategoriesForm 
} from './controllers/categories.js'; 
import { testErrorPage } from './controllers/errors.js'; 
import { 
  showUserRegistrationForm, 
  processUserRegistrationForm, 
  showLoginForm, 
  processLoginForm, 
  processLogout, 
  showDashboard, 
  showUsersPage, 
  requireLogin, 
  requireRole 
} from './controllers/users.js'; 

const router = express.Router(); 

// ─── Home ───────────────────────────────────────────────────────────────────── 
router.get('/', showHomePage); 

// ─── Authentication ─────────────────────────────────────────────────────────── 
router.get('/register', showUserRegistrationForm); 
router.post('/register', processUserRegistrationForm); 
router.get('/login', showLoginForm); 
router.post('/login', processLoginForm); 
router.get('/logout', processLogout); 

// ─── Protected dashboard ────────────────────────────────────────────────────── 
router.get('/dashboard', requireLogin, showDashboard); 

// ─── Admin: Users list ──────────────────────────────────────────────────────── 
router.get('/users', requireLogin, requireRole('admin'), showUsersPage); 

// ─── Organizations ──────────────────────────────────────────────────────────── 
router.get('/organizations', showOrganizationsPage); 
router.get('/organization/:id', showOrganizationDetailsPage); 

// Create new organization (admin only) 
router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm); 
router.post('/new-organization', requireLogin, requireRole('admin'), organizationValidation, processNewOrganizationForm); 

// Edit existing organization (admin only) 
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm); 
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationValidation, processEditOrganizationForm); 

// ─── Projects / Services ────────────────────────────────────────────────────── 
router.get('/projects', showProjectsPage); 
router.get('/services', showServicesPage); 
router.get('/project/:id', showProjectDetailsPage); 

// Create new project (admin only) 
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm); 
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, processNewProjectForm); 

// Edit existing project (admin only) 
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm); 
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, processEditProjectForm); 

// ─── Categories ─────────────────────────────────────────────────────────────── 
router.get('/categories', showCategoriesPage); 
router.get('/category/:id', showCategoryDetailsPage); 

// Create new category (admin only) 
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm); 
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, processNewCategoryForm); 

// Edit existing category (admin only) 
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm); 
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, processEditCategoryForm); 

// Assign categories to a project (admin only) 
router.get('/project/:projectId/assign-categories', requireLogin, requireRole('admin'), showAssignCategoriesForm); 
router.post('/project/:projectId/assign-categories', requireLogin, requireRole('admin'), processAssignCategoriesForm); 

// ─── Development error test ─────────────────────────────────────────────────── 
router.get('/test-error', testErrorPage); 

export default router;

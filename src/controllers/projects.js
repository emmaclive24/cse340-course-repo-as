import { body, validationResult } from 'express-validator';
import {
    getAllProjects,
    getUpcomingProjects,
    getProjectById,
    createProject,
    updateProject
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// ─── Validation rules ─────────────────────────────────────────────────────────
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Project description is required')
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Please select a valid organization')
];

// ─── Controllers ──────────────────────────────────────────────────────────────

// Display the next 5 upcoming service projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects();
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

// Display all service projects (the Services tab)
const showServicesPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('services', { title: 'All Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

// Display the details page for a single service project
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// GET /new-project — show the create project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', {
            title: 'Add New Service Project',
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// POST /new-project — process the create project form
const processNewProjectForm = async (req, res, next) => {
    try {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-project');
        }

        const { organizationId, title, description, location, date } = req.body;
        const projectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'Service project added successfully!');
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// GET /edit-project/:id — show the edit project form pre-populated
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectById(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Service Project',
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// POST /edit-project/:id — process the edit project form
const processEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect(`/edit-project/${projectId}`);
        }

        const { title, description, location, date, organizationId } = req.body;
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showServicesPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};

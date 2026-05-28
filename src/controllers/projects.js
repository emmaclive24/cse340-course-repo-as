import { getAllProjects, getUpcomingProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

export { showProjectsPage, showServicesPage, showProjectDetailsPage };

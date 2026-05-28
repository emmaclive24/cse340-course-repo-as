import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Display the list of all partner organizations
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (error) {
        next(error);
    }
};

// Display the details page for a single organization
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render('organization', {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        next(error);
    }
};

export { showOrganizationsPage, showOrganizationDetailsPage };

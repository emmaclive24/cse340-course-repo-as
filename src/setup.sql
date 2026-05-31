-- ORGANIZATION TABLE
CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
SELECT * FROM (VALUES
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png')
) AS v(name, description, contact_email, logo_filename)
WHERE NOT EXISTS (SELECT 1 FROM organization LIMIT 1);

-- SERVICE PROJECT TABLE
CREATE TABLE IF NOT EXISTS service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    location VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO service_project (organization_id, title, description, location, date)
SELECT * FROM (VALUES
    (1, 'Park Cleanup - Downtown', 'Join us to clean up local parks, paint benches, and make them beautiful!', 'Central Park, Downtown', '2026-06-05'::DATE),
    (1, 'Tree Planting Initiative', 'Help us plant 100 new native trees to increase shade and improve air quality.', 'Greenwood Nature Reserve', '2026-06-20'::DATE),
    (1, 'Beach & River Clean', 'Volunteers needed to collect plastic and debris along the river banks.', 'Riverside Community Park', '2026-07-11'::DATE),
    (1, 'Community Garden Setup', 'Help build raised beds and plant seeds for our new urban vegetable garden.', 'East Side Neighborhood Center', '2026-07-25'::DATE),
    (1, 'Botanical Trail Maintenance', 'Clear weeds and repair signs along the public educational walking trails.', 'Botanical Gardens Extension', '2026-08-08'::DATE),
    (2, 'Food Drive - Sorting Center', 'Help collect, sort, and distribute non-perishable food to families in need.', 'Community Food Bank Warehouse', '2026-06-10'::DATE),
    (2, 'Soup Kitchen Meal Prep', 'Volunteer to prepare and serve warm lunches for shelter residents.', 'Hope Soup Kitchen', '2026-06-24'::DATE),
    (2, 'Homeless Shelter Supply Pack', 'Assemble hygiene kits and winter blankets for distribution drives.', 'Downtown Rescue Mission', '2026-07-15'::DATE),
    (2, 'Senior Nutrition Delivery', 'Drivers and helpers needed to deliver fresh meals to homebound elderly citizens.', 'St. Jude Senior Center', '2026-08-01'::DATE),
    (2, 'Back-to-School Food Pack', 'Prepare weekend food backpacks for children from low-income households.', 'Westside Elementary Hub', '2026-08-15'::DATE),
    (3, 'Community Tutoring - Math & Science', 'Volunteer to tutor high school students in math, algebra, and basic physics.', 'Public Library, Room B', '2026-06-12'::DATE),
    (3, 'English Language Practice', 'Help adult immigrants practice conversational English in a friendly environment.', 'Community Language Institute', '2026-07-02'::DATE),
    (3, 'Kids Reading Circle', 'Read engaging books to young children and help improve their literacy skills.', 'Childrens Hospital Library', '2026-07-18'::DATE),
    (3, 'Coding for Teens Workshop', 'Assist as a mentor teaching basic HTML, CSS, and JavaScript concepts.', 'Tech Innovation Lab', '2026-08-05'::DATE),
    (3, 'Exam Prep Boot Camp', 'Help students study and prepare for upcoming college entrance examinations.', 'Youth Development Center', '2026-08-22'::DATE)
) AS v(organization_id, title, description, location, date)
WHERE NOT EXISTS (SELECT 1 FROM service_project LIMIT 1);

-- CATEGORY TABLE
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO category (name)
SELECT * FROM (VALUES
    ('Environment & Conservation'),
    ('Hunger & Social Welfare'),
    ('Education & Literacy')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM category LIMIT 1);

-- JUNCTION TABLE
CREATE TABLE IF NOT EXISTS project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_jc_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_jc_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id)
SELECT * FROM (VALUES
    (1,1),(2,1),(3,1),(4,1),(5,1),
    (6,2),(7,2),(8,2),(9,2),(10,2),
    (11,3),(12,3),(13,3),(14,3),(15,3),
    (4,2),(14,2)
) AS v(project_id, category_id)
WHERE NOT EXISTS (SELECT 1 FROM project_category LIMIT 1);

-- ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description)
SELECT * FROM (VALUES
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access')
) AS v(role_name, role_description)
WHERE NOT EXISTS (SELECT 1 FROM roles LIMIT 1);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

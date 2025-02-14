-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type for event categories
CREATE TYPE event_category_enum AS ENUM ('CONFERENCE', 'MEETUP', 'WORKSHOP', 'OTHER');

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    location JSONB NOT NULL,
    category event_category_enum NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data
INSERT INTO events (id, title, description, date, location, category) VALUES
(uuid_generate_v4(), 'Tech Conference 2025', 'Annual technology conference featuring latest innovations in AI, ML, and cloud computing', '2025-06-15 09:00:00', '{"address": "123 Tech Street, San Francisco, CA", "latitude": 37.7749, "longitude": -122.4194}', 'CONFERENCE'),
(uuid_generate_v4(), 'JavaScript Developers Meetup', 'Monthly meetup for JavaScript developers to discuss new frameworks and best practices', '2025-03-20 18:30:00', '{"address": "456 Code Avenue, New York, NY", "latitude": 40.7128, "longitude": -74.0060}', 'MEETUP'),
(uuid_generate_v4(), 'DevOps Best Practices Workshop', 'Hands-on workshop covering CI/CD, containerization, and cloud deployment', '2025-04-10 10:00:00', '{"address": "789 Docker Lane, Seattle, WA", "latitude": 47.6062, "longitude": -122.3321}', 'WORKSHOP'),
(uuid_generate_v4(), 'AI/ML Summit 2025', 'Conference focused on artificial intelligence and machine learning advancements', '2025-05-01 09:00:00', '{"address": "321 Neural Street, Austin, TX", "latitude": 30.2672, "longitude": -97.7431}', 'CONFERENCE'),
(uuid_generate_v4(), 'Web Development Bootcamp', 'Intensive workshop on modern web development techniques', '2025-03-25 09:00:00', '{"address": "654 React Road, Boston, MA", "latitude": 42.3601, "longitude": -71.0589}', 'WORKSHOP'),
(uuid_generate_v4(), 'Cybersecurity Conference', 'Annual conference on latest cybersecurity threats and defenses', '2025-07-12 09:00:00', '{"address": "987 Security Blvd, Las Vegas, NV", "latitude": 36.1699, "longitude": -115.1398}', 'CONFERENCE'),
(uuid_generate_v4(), 'React Native Meetup', 'Mobile app development discussion and code review session', '2025-04-05 18:00:00', '{"address": "741 Mobile Ave, Chicago, IL", "latitude": 41.8781, "longitude": -87.6298}', 'MEETUP'),
(uuid_generate_v4(), 'Data Science Workshop', 'Practical workshop on data analysis and visualization', '2025-05-20 10:00:00', '{"address": "852 Data Street, Portland, OR", "latitude": 45.5155, "longitude": -122.6789}', 'WORKSHOP'),
(uuid_generate_v4(), 'Cloud Computing Summit', 'Conference on cloud technologies and serverless architecture', '2025-08-15 09:00:00', '{"address": "369 Cloud Road, Miami, FL", "latitude": 25.7617, "longitude": -80.1918}', 'CONFERENCE'),
(uuid_generate_v4(), 'Python Developers Meetup', 'Monthly gathering for Python enthusiasts', '2025-04-15 19:00:00', '{"address": "147 Python Lane, Denver, CO", "latitude": 39.7392, "longitude": -104.9903}', 'MEETUP'),
(uuid_generate_v4(), 'Blockchain Technology Workshop', 'Deep dive into blockchain development and cryptocurrencies', '2025-06-01 10:00:00', '{"address": "258 Chain Street, Atlanta, GA", "latitude": 33.7490, "longitude": -84.3880}', 'WORKSHOP'),
(uuid_generate_v4(), 'UX/UI Design Conference', 'Conference focusing on user experience and interface design', '2025-09-10 09:00:00', '{"address": "963 Design Blvd, Los Angeles, CA", "latitude": 34.0522, "longitude": -118.2437}', 'CONFERENCE'),
(uuid_generate_v4(), 'Docker & Kubernetes Meetup', 'Container orchestration and deployment strategies discussion', '2025-05-05 18:30:00', '{"address": "357 Container Way, Phoenix, AZ", "latitude": 33.4484, "longitude": -112.0740}', 'MEETUP'),
(uuid_generate_v4(), 'Digital Marketing Workshop', 'SEO, social media, and content marketing strategies', '2025-07-01 10:00:00', '{"address": "159 Marketing Street, Houston, TX", "latitude": 29.7604, "longitude": -95.3698}', 'WORKSHOP'),
(uuid_generate_v4(), 'IoT Innovation Summit', 'Internet of Things and smart device development conference', '2025-10-05 09:00:00', '{"address": "753 Smart Drive, Detroit, MI", "latitude": 42.3314, "longitude": -83.0458}', 'CONFERENCE'),
(uuid_generate_v4(), 'Vue.js Developers Meetup', 'Frontend development with Vue.js framework', '2025-06-20 18:00:00', '{"address": "951 Vue Road, Philadelphia, PA", "latitude": 39.9526, "longitude": -75.1652}', 'MEETUP'),
(uuid_generate_v4(), 'Agile Project Management Workshop', 'Scrum and Kanban methodologies in practice', '2025-08-01 10:00:00', '{"address": "357 Agile Lane, Minneapolis, MN", "latitude": 44.9778, "longitude": -93.2650}', 'WORKSHOP'),
(uuid_generate_v4(), 'Game Development Conference', 'Video game development and gaming industry insights', '2025-11-15 09:00:00', '{"address": "852 Game Street, San Diego, CA", "latitude": 32.7157, "longitude": -117.1611}', 'CONFERENCE'),
(uuid_generate_v4(), 'TypeScript Coding Meetup', 'Best practices and patterns in TypeScript development', '2025-07-10 18:30:00', '{"address": "456 Type Lane, Salt Lake City, UT", "latitude": 40.7608, "longitude": -111.8910}', 'MEETUP'),
(uuid_generate_v4(), 'Mobile App Testing Workshop', 'Quality assurance and testing for mobile applications', '2025-09-01 10:00:00', '{"address": "159 Testing Road, Nashville, TN", "latitude": 36.1627, "longitude": -86.7816}', 'WORKSHOP');
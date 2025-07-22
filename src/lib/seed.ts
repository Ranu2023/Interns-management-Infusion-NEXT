'use server';

import 'dotenv/config'; // Load environment variables from .env file
import dbConnect from './db';
import Application from './models/Application';
import Intern from './models/Intern';
import Mentor from './models/Mentor';
import Project from './models/Project';
import { initialData } from './seed-data';

async function seedDatabase() {
    try {
        await dbConnect();

        // Clear existing collections
        await Application.deleteMany({});
        await Intern.deleteMany({});
        await Mentor.deleteMany({});
        await Project.deleteMany({});

        console.log('Cleared existing data.');

        // Insert new data
        await Application.insertMany(initialData.applications);
        console.log('Seeded applications.');
        
        await Intern.insertMany(initialData.interns);
        console.log('Seeded interns.');
        
        await Mentor.insertMany(initialData.mentors);
        console.log('Seeded mentors.');

        // The seed data for projects needs to be processed to match the schema.
        // The schema expects an array of Tasks, not just a number.
        const projectsToSeed = initialData.projects.map(p => ({
            ...p,
            progress: p.tasks.length > 0 ? (p.tasks.filter(t => t.completed).length / p.tasks.length) * 100 : 0,
        }));

        await Project.insertMany(projectsToSeed);
        console.log('Seeded projects.');

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit();
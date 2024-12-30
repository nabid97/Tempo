// Import necessary modules
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app'); // Assuming your Express app is exported from a file named app.js

// Test setup
beforeAll(async () => {
    const DB_URI = "mongodb://localhost:27017/jobPlatformTest";
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('User Authentication', () => {
    test('Register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testUser',
                password: 'password123',
                role: 'employee'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    test('Login with registered user', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'testUser',
                password: 'password123'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});

describe('Job Posting and Application', () => {
    let employerToken, employeeToken, jobId;

    test('Employer login and post a job', async () => {
        // Register employer
        await request(app)
            .post('/register')
            .send({
                username: 'employerUser',
                password: 'password123',
                role: 'employer'
            });

        // Login employer
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'employerUser',
                password: 'password123'
            });
        employerToken = loginResponse.body.token;

        // Post job
        const jobResponse = await request(app)
            .post('/jobs')
            .set('Authorization', employerToken)
            .send({
                title: 'Software Engineer',
                description: 'Looking for a skilled software engineer.'
            });
        expect(jobResponse.statusCode).toBe(201);
        expect(jobResponse.body.message).toBe('Job posted successfully');

        // Capture job ID
        const jobs = await request(app).get('/jobs');
        jobId = jobs.body[0]._id;
    });

    test('Employee login and apply for a job', async () => {
        // Login employee
        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'testUser',
                password: 'password123'
            });
        employeeToken = loginResponse.body.token;

        // Apply for job
        const response = await request(app)
            .post(`/jobs/${jobId}/apply`)
            .set('Authorization', employeeToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Applied successfully');
    });
});

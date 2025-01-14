const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

jest.setTimeout(60000);

beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas connected successfully');
    } catch (err) {
        console.error('MongoDB Atlas connection error:', err);
        throw err;
    }
});

afterAll(async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
    }
});

beforeEach(async () => {
    try {
        if (mongoose.connection.collections.users) {
            await mongoose.connection.collections.users.deleteMany({});
        }
        if (mongoose.connection.collections.jobs) {
            await mongoose.connection.collections.jobs.deleteMany({});
        }
    } catch (err) {
        console.error('Error clearing collections:', err);
    }
});

describe('User Authentication', () => {
    test('Register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testUser',
                password: 'password123',
                role: 'employee'
            });

        console.log('Register Response:', response.body);
        expect(response.statusCode).toBe(201);
    });

    test('Login with registered user', async () => {
        // First register the user
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testUser',
                password: 'password123',
                role: 'employee'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testUser',
                password: 'password123'
            });

        console.log('Login Response:', response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('Login with invalid credentials should fail', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testUser',
                password: 'password123',
                role: 'employee'
            });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testUser',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    test('Register with invalid role should fail', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testUser',
                password: 'password123',
                role: 'admin'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('Invalid role');
    });
});

describe('Job Posting and Application', () => {
    test('Employee should not be able to post a job', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'employee',
                password: 'password123',
                role: 'employee'
            });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'employee',
                password: 'password123'
            });

        const employeeToken = loginResponse.body.token;

        const jobResponse = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${employeeToken}`)
            .send({
                title: 'Test Job',
                description: 'This should fail'
            });

        expect(jobResponse.statusCode).toBe(403);
        expect(jobResponse.body.error).toBe('Access denied');
    });

    test('Apply to non-existent job should fail', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'employee2',
                password: 'password123',
                role: 'employee'
            });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'employee2',
                password: 'password123'
            });

        const employeeToken = loginResponse.body.token;
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        console.log('Test - Using Job ID:', nonExistentId);

        const applyResponse = await request(app)
            .post(`/api/jobs/${nonExistentId}/apply`)
            .set('Authorization', `Bearer ${employeeToken}`)
            .send({
                coverLetter: 'Testing invalid job application'
            });

        console.log('Apply Response Details:', {
            statusCode: applyResponse.statusCode,
            body: applyResponse.body
        });

        expect(applyResponse.statusCode).toBe(404);
        expect(applyResponse.body.error).toBe('Job not found');
    });

    test('Employer should not be able to apply to jobs', async () => {
        // Register and login first employer
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'employer1',
                password: 'password123',
                role: 'employer'
            });

        const employer1Login = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'employer1',
                password: 'password123'
            });

        const employer1Token = employer1Login.body.token;

        // Create a job
        const createJobResponse = await request(app)
            .post('/api/jobs')
            .set('Authorization', `Bearer ${employer1Token}`)
            .send({
                title: 'Test Job',
                description: 'Test Description'
            });

        const jobId = createJobResponse.body.job._id;

        // Register and login second employer
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'employer2',
                password: 'password123',
                role: 'employer'
            });

        const employer2Login = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'employer2',
                password: 'password123'
            });

        const employer2Token = employer2Login.body.token;

        const applyResponse = await request(app)
            .post(`/api/jobs/${jobId}/apply`)
            .set('Authorization', `Bearer ${employer2Token}`)
            .send({
                coverLetter: 'This should fail'
            });

        expect(applyResponse.statusCode).toBe(403);
        expect(applyResponse.body.error).toBe('Access denied');
    });

    test('Request without authentication token should fail', async () => {
        const response = await request(app)
            .post('/api/jobs')
            .send({
                title: 'Test Job',
                description: 'This should fail'
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe('No token provided');
    });
});
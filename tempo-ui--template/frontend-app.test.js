// Import required modules
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App'; // Assuming App.js is the root component of your app
import axios from 'axios';

// Mock Axios for API calls
jest.mock('axios');

describe('React Frontend Tests', () => {
    // Utility function to render components wrapped with a router
    const renderWithRouter = (ui) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test('Renders login page correctly', () => {
        renderWithRouter(<App />);
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('Handles user login correctly', async () => {
        axios.post.mockResolvedValue({
            data: {
                token: 'fake-jwt-token',
            },
        });

        renderWithRouter(<App />);

        // Simulate entering username and password
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testUser' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        // Simulate login button click
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for the API call to resolve
        const welcomeMessage = await screen.findByText(/welcome, testUser/i);
        expect(welcomeMessage).toBeInTheDocument();
    });

    test('Displays job listings', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, title: 'Software Engineer', description: 'Develop amazing software.' },
                { id: 2, title: 'Product Manager', description: 'Oversee product development.' },
            ],
        });

        renderWithRouter(<App />);

        // Simulate navigating to job listings
        fireEvent.click(screen.getByRole('link', { name: /jobs/i }));

        // Wait for job listings to load
        const job1 = await screen.findByText(/software engineer/i);
        const job2 = await screen.findByText(/product manager/i);

        expect(job1).toBeInTheDocument();
        expect(job2).toBeInTheDocument();
    });

    test('Handles job application', async () => {
        axios.post.mockResolvedValue({
            data: { message: 'Application successful' },
        });

        renderWithRouter(<App />);

        // Simulate navigating to job details
        fireEvent.click(screen.getByRole('link', { name: /jobs/i }));
        const applyButton = await screen.findByRole('button', { name: /apply/i });

        // Simulate applying for a job
        fireEvent.click(applyButton);

        // Wait for confirmation message
        const confirmationMessage = await screen.findByText(/application successful/i);
        expect(confirmationMessage).toBeInTheDocument();
    });
});

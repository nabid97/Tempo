import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Frontend tests
describe('App Component', () => {
  test('renders App component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check if the Navbar is rendered
    expect(screen.getByText(/Tempo Job-Platform/i)).toBeInTheDocument();

    // Check if the navigation links are present
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Jobs/i)).toBeInTheDocument();
  });

  test('renders Welcome message on the home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check if the welcome message is rendered
    expect(screen.getByText(/Welcome to Tempo/i)).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthComponent from '../AuthComponent';
import { useAuth } from '../../theme/Root'; // Import useAuth directly from Root.tsx

// Mock window.location.href for testing redirects
const assignMock = jest.fn();
delete window.location;
window.location = { assign: assignMock } as any;

// Mock the useAuth hook to control its return value in tests
jest.mock('../../theme/Root', () => ({
  ...jest.requireActual('../../theme/Root'), // Keep actual implementations for other exports
  useAuth: jest.fn(), // Mock useAuth specifically
}));

describe('AuthComponent', () => {
  beforeEach(() => {
    assignMock.mockClear();
    // Reset mock before each test to ensure isolation
    (useAuth as jest.Mock).mockReset();
  });

  it('renders login button when not authenticated and redirects on click', async () => {
    // Mock for unauthenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(() => window.location.assign('http://localhost:8000/api/auth/google')),
      logout: jest.fn(),
      isLoading: false,
    });

    render(<AuthComponent />);

    const loginButton = screen.getByRole('button', { name: /login with google/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(assignMock).toHaveBeenCalledWith('http://localhost:8000/api/auth/google');
  });

  it('renders welcome message and logout button when authenticated and calls logout on click', async () => {
    const mockLogout = jest.fn();
    // Mock for authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '123', name: 'Test User', email: 'test@example.com', provider: 'google' },
      login: jest.fn(),
      logout: mockLogout,
      isLoading: false,
    });

    render(<AuthComponent />);

    expect(screen.getByText(/welcome, test user!/i)).toBeInTheDocument();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('renders loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      isLoading: true,
    });

    render(<AuthComponent />);
    expect(screen.getByText(/loading authentication status.../i)).toBeInTheDocument();
  });
});
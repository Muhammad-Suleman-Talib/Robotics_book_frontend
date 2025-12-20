import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface LoginFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { siteConfig } = useDocusaurusContext();
  const backendUrl = siteConfig.customFields?.backendUrl || 'http://localhost:8000'; // Fallback URL

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the backend sets a session cookie on successful login
        // No need to store token client-side if using HttpOnly cookies
        setMessage('Login successful!');
        onSuccess();
        // Optionally, redirect or update UI based on successful login
      } else {
        onError(data.detail || data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      onError('Network error or server unreachable.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {message && <p className="alert alert--success">{message}</p>}
      <div className="margin-bottom--md">
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="margin-bottom--md">
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="button button--primary button--block">
        Login
      </button>
    </form>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface RegisterFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { siteConfig } = useDocusaurusContext();
  const backendUrl = siteConfig.customFields?.backendUrl || 'http://localhost:8000'; // Fallback URL

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      onError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Registration successful. Please check your email.');
        onSuccess();
      } else {
        onError(data.detail || data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      onError('Network error or server unreachable.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {message && <p className="alert alert--success">{message}</p>}
      <div className="margin-bottom--md">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="margin-bottom--md">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="margin-bottom--md">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="button button--primary button--block">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;

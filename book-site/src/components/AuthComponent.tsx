import React, { useState } from 'react';
import styles from '/src/pages/index.module.css';
import { useAuth } from '../theme/Root';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

interface AuthComponentProps {
  initialShowRegisterForm?: boolean;
}

export default function AuthComponent({ initialShowRegisterForm = false }: AuthComponentProps): JSX.Element {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();
  const [activeCard, setActiveCard] = useState<'login' | 'register'>(initialShowRegisterForm ? 'register' : 'login');
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (isLoading) {
    return <div className={styles.loading}>Loading…</div>;
  }

  if (isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <span className={styles.welcome}>Hi, {user?.name ?? user?.email ?? 'User'}</span>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {authMessage && <div className={`${styles.message} ${styles[authMessage.type]}`}>{authMessage.text}</div>}

      {/* TAB BUTTONS */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeCard === 'login' ? styles.active : ''}`}
          onClick={() => setActiveCard('login')}
        >
          Login
        </button>
        <button
          className={`${styles.tabBtn} ${activeCard === 'register' ? styles.active : ''}`}
          onClick={() => setActiveCard('register')}
        >
          Register
        </button>
      </div>

      {/* CARD */}
      <div className={styles.card}>
        {activeCard === 'login' ? (
          <>
            <LoginForm onSuccess={() => setAuthMessage({ type: 'success', text: 'Login successful!' })}
                       onError={(msg) => setAuthMessage({ type: 'error', text: msg })} />
            <div className={styles.divider}>OR</div>
            <button onClick={() => login('google')} className={styles.socialBtn}>Continue with Google</button>
            <button onClick={() => login('github')} className={styles.socialBtn}>Continue with GitHub</button>
            <button onClick={() => login('facebook')} className={styles.socialBtn}>Continue with Facebook</button>
          </>
        ) : (
          <RegisterForm onSuccess={() => setAuthMessage({ type: 'success', text: 'Registration successful!' })}
                        onError={(msg) => setAuthMessage({ type: 'error', text: msg })} />
        )}
      </div>
    </div>
  );
}

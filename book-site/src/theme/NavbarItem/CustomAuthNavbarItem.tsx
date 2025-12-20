import React, { useState } from 'react';
import AuthComponent from '../../components/AuthComponent';
import { useAuth } from '../Root'; // Assuming useAuth is available from Root.tsx

type AuthFormType = 'login' | 'register';

export default function CustomAuthNavbarItem(): JSX.Element {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [initialForm, setInitialForm] = useState<AuthFormType>('login'); // State to control which form to show

  const openModal = (formType: AuthFormType) => {
    setInitialForm(formType);
    setShowModal(true);
  };

  // Early return for loading state or if already authenticated
  if (isLoading) {
    return <div className="navbar__item">Loading Auth...</div>;
  }

  if (isAuthenticated) {
    return (
      <button className="navbar__item navbar__link" onClick={logout}>
        Logout
      </button>
    );
  }

  return (
    <>
      <button className="navbar__item navbar__link" onClick={() => openModal('login')}>
        Login
      </button>
      <button className="navbar__item navbar__link" onClick={() => openModal('register')}>
        Register
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <AuthComponent initialShowRegisterForm={initialForm === 'register'} />
          </div>
        </div>
      )}
    </>
  );
}

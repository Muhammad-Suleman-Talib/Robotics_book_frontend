// ThemeToggle.jsx
import { useEffect, useState } from 'react';
import './index.module.css';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                      (!document.body.classList.contains('light-mode') && 
                       window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('light-mode', isDark);
    document.body.classList.toggle('dark-mode', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <button className="themeToggle" onClick={toggleTheme}>
      {isDark ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Light Mode
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          Dark Mode
        </>
      )}
    </button>
  );
}
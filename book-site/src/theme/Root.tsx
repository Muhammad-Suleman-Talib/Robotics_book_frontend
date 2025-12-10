// book-site/src/theme/Root.tsx
import React from 'react';
type RootType = React.FC<{ children: React.ReactNode }>;
import ChatWidget from '../components/ChatWidget';

// Default implementation of Root from Docusaurus
// You might need to adjust this based on your Docusaurus version
// or if you have an existing custom Root component.
const Root: RootType = ({ children }) => {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
};

export default Root;
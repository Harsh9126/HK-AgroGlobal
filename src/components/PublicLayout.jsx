import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PublicLayout
 * Wraps public-facing routes with the standard Navbar and Footer.
 */
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;

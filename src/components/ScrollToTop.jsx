import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately bypassing smooth scrolling if possible
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
    
    // Fallback timeout in case DOM changes shift position
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

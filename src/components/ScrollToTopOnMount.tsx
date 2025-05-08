
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A component that scrolls the page to the top when mounted.
 * Useful for page transitions in a React Router application.
 */
const ScrollToTopOnMount = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

export default ScrollToTopOnMount;

import { useLocation } from '@remix-run/react';

/**
 * Utility function to handle smart back navigation for settings pages
 * - Uses URL parameter 'from' to determine which tab to return to
 * - If no 'from' parameter (reload/direct access), navigates to /app/settings
 * - If 'from' parameter exists, navigates back to specific tab
 */
export const useSmartBackNavigation = (navigate: (path: string) => void) => {
  const location = useLocation();
  
  const handleBackNavigation = () => {
    // Get the 'from' parameter from current URL using useLocation
    const urlParams = new URLSearchParams(location.search);
    const fromTab = urlParams.get('from');
    
    if (fromTab) {
      // Navigate back to the specific tab
      navigate(`/app/settings?tab=${fromTab}`);
    } else {
      // No 'from' parameter - navigate to default settings
      navigate('/app/settings');
    }
  };

  return { handleBackNavigation };
};
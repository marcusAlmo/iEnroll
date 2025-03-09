/**
 * Implement global providers here
 * 
 * To-implement:
 * - NavigationBlockerProvider (to prevent navigation during half-filled forms)
 * - SettingsProvider (for setting configuration)
 * - AuthProvider (for authentication)
 */

import { ReactNode } from 'react';
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext';
import { AuthProvider } from '../contexts/AuthContext';

interface AppProviderProps {
  children: ReactNode
};

// Uncomment the commented lines once the providers are implemented
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ScreenSizeProvider>
      <AuthProvider>
        {/* <NavigationGuardProvider> */}
          {children}
        {/* </NavigationGuardProvider> */}
      </AuthProvider>
    </ScreenSizeProvider>
  )
};


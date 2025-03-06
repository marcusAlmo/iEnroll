/**
 * Implement global providers here
 * 
 * To-implement:
 * - NavigationBlockerProvider (to prevent navigation during half-filled forms)
 * - SettingsProvider (for setting configuration)
 * - AuthProvider (for authentication)
 */

import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode
};

// Uncomment the following code block once the providers are implemented

// const AppProvider = ({ children }: AppProviderProps) => {
//   <AuthProvider>
//     <NavigationGuardProvider>
//       {children}
//     </NavigationGuardProvider>
//   </AuthProvider>
// };


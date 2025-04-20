/**
 * Implement global providers here
 *
 * To-implement:
 * - NavigationBlockerProvider (to prevent navigation during half-filled forms)
 * - SettingsProvider (for setting configuration)
 * - AuthProvider (for authentication)
 */

import { ReactNode } from "react";
import { ScreenSizeProvider } from "../contexts/ScreenSizeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { EnrollmentReviewProvider } from "./admin/context/enrollmentReviewContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

// Uncomment the commented lines once the providers are implemented
export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ScreenSizeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <EnrollmentReviewProvider>
            {/* <NavigationGuardProvider> */}
            {children}
            {/* </NavigationGuardProvider> */}
          </EnrollmentReviewProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ScreenSizeProvider>
  );
};

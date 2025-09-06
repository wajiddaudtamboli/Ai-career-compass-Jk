// Clerk configuration and provider setup
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.warn('Clerk publishable key not found. Authentication features will be disabled.');
}

export const ClerkProviderWrapper = ({ children }) => {
  if (!clerkPubKey) {
    // Return children without Clerk if no key is provided
    return <>{children}</>;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: 'rgba(15, 23, 42, 0.95)',
          colorInputBackground: 'rgba(30, 41, 59, 0.8)',
          colorInputText: '#F1F5F9',
        },
        elements: {
          rootBox: {
            backdropFilter: 'blur(20px)',
          },
          card: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;

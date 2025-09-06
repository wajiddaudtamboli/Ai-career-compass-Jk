// Temporary mock for Clerk while package is being installed
import React, { createContext, useContext, useState } from 'react';

// Mock Clerk context
const MockClerkContext = createContext({
  user: null,
  isSignedIn: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {}
});

export const useMockUser = () => {
  const context = useContext(MockClerkContext);
  return { user: context.user, isSignedIn: context.isSignedIn };
};

export const MockSignInButton = ({ children, mode, ...props }) => {
  const { signIn } = useContext(MockClerkContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mock Sign In clicked');
    signIn();
  };
  
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }} {...props}>
      {children}
    </div>
  );
};

export const MockSignUpButton = ({ children, mode, ...props }) => {
  const { signUp } = useContext(MockClerkContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mock Sign Up clicked');
    signUp();
  };
  
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }} {...props}>
      {children}
    </div>
  );
};

export const MockUserButton = ({ appearance, ...props }) => {
  const { signOut } = useContext(MockClerkContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mock User Button clicked - signing out');
    signOut();
  };
  
  return (
    <div 
      className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors"
      onClick={handleClick}
      title="Click to sign out"
      {...props}
    >
      👤
    </div>
  );
};

export const MockSignedIn = ({ children }) => {
  const { isSignedIn } = useMockUser();
  return isSignedIn ? children : null;
};

export const MockSignedOut = ({ children }) => {
  const { isSignedIn } = useMockUser();
  return !isSignedIn ? children : null;
};

export default function ClerkProviderWrapper({ children }) {
  const [user, setUser] = useState(null);
  
  const mockClerkValue = {
    user,
    isSignedIn: !!user,
    signIn: () => setUser({ 
      firstName: 'Demo', 
      lastName: 'User', 
      primaryEmailAddress: { emailAddress: 'demo@jkcareer.com' },
      imageUrl: null,
      createdAt: new Date().toISOString()
    }),
    signUp: () => setUser({ 
      firstName: 'New', 
      lastName: 'Student', 
      primaryEmailAddress: { emailAddress: 'student@jkcareer.com' },
      imageUrl: null,
      createdAt: new Date().toISOString()
    }),
    signOut: () => setUser(null)
  };

  return (
    <MockClerkContext.Provider value={mockClerkValue}>
      {children}
    </MockClerkContext.Provider>
  );
}

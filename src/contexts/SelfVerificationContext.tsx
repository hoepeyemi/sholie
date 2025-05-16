'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SelfVerificationContextType {
  isVerified: boolean;
  setIsVerified: (value: boolean) => void;
  clearVerification: () => void;
}

const SelfVerificationContext = createContext<SelfVerificationContextType | undefined>(undefined);

export const SelfVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Check if the user is already verified on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVerification = localStorage.getItem('selfVerified');
      if (storedVerification === 'true') {
        setIsVerified(true);
      }
    }
  }, []);

  // Update localStorage when verification status changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isVerified) {
        localStorage.setItem('selfVerified', 'true');
      }
    }
  }, [isVerified]);

  const clearVerification = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selfVerified');
    }
    setIsVerified(false);
  };

  return (
    <SelfVerificationContext.Provider value={{ isVerified, setIsVerified, clearVerification }}>
      {children}
    </SelfVerificationContext.Provider>
  );
};

export const useSelfVerification = (): SelfVerificationContextType => {
  const context = useContext(SelfVerificationContext);
  if (context === undefined) {
    throw new Error('useSelfVerification must be used within a SelfVerificationProvider');
  }
  return context;
}; 
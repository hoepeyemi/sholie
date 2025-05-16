'use client';

import React, { useEffect, useState } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';

interface DynamicSelfComponentsProps {
  userId: string;
  onSuccess: () => void;
}

const DynamicSelfComponents: React.FC<DynamicSelfComponentsProps> = ({ 
  userId, 
  onSuccess 
}) => {
  const [selfApp, setSelfApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    try {
      const app = new SelfAppBuilder({
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "DUMIOL BATTLE ARENA",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "dumiol-battle-arena",
        endpoint: `${window.location.origin}/api/self/callback`,
        userId,
        // Optional disclosure requirements
        disclosures: {
          // Request basic identity verification
          name: true,
          date_of_birth: true,
          // Set verification rules
          minimumAge: 18,
        },
      }).build();
      
      setSelfApp(app);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating SelfApp:', error);
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading || !selfApp) {
    return (
      <div className="flex items-center justify-center" style={{ width: '250px', height: '250px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SelfQRcodeWrapper
      selfApp={selfApp}
      onSuccess={onSuccess}
      size={250}
      darkMode={false}
    />
  );
};

export default DynamicSelfComponents; 
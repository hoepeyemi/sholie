'use client';

import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSelfVerification } from '../contexts/SelfVerificationContext';
import SelfVerification from './SelfVerification';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const CustomConnectButton: React.FC = () => {
  const { isVerified, setIsVerified } = useSelfVerification();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleConnectClick = () => {
    if (!isVerified) {
      setIsVerificationModalOpen(true);
    }
  };

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setTimeout(() => {
      setIsVerificationModalOpen(false);
    }, 1500); // Give the user a moment to see the success message
  };

  return (
    <>
      <div onClick={handleConnectClick}>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={isVerified ? openConnectModal : undefined}
                        type="button"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button" className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex gap-3">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="flex items-center bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>

      {/* Self Verification Modal */}
      <Dialog
        open={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-gray-900 p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold text-white">
                Identity Verification Required
              </Dialog.Title>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <SelfVerification onVerificationComplete={handleVerificationComplete} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default CustomConnectButton; 
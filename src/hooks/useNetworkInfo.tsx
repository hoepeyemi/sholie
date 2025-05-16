import { useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { base, baseSepolia } from 'wagmi/chains';

export function useNetworkInfo() {
  const chainId = useChainId();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check if connected to Base Mainnet or Base Sepolia
  const isMainnet = isMounted && chainId === base.id;
  const isTestnet = isMounted && chainId === baseSepolia.id;
  
  // Determine network name based on chain ID
  let networkName = "Unknown Network";
  let networkClass = "bg-gray-900/50 text-gray-400";
  let tokenSymbol = "ETH"; // Default symbol is ETH
  
  if (isMainnet) {
    networkName = "Base Mainnet";
    networkClass = "bg-green-900/50 text-green-400";
    tokenSymbol = "ETH";
  } else if (isTestnet) {
    networkName = "Base Sepolia";
    networkClass = "bg-blue-900/50 text-blue-400";
    tokenSymbol = "ETH";
  }
  
  return {
    chainId,
    isMainnet,
    isTestnet,
    networkName,
    networkClass,
    tokenSymbol,
    isMounted
  };
} 
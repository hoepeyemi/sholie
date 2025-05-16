import { useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { abi as testnetAbi, contractAddress as testnetAddress } from '../constants/contractInfo';
import { abi as mainnetAbi, contractAddress as mainnetAddress } from '../constants/contractInfoMainnet';
import { base, baseSepolia } from 'wagmi/chains';

export function useContractInfo() {
  const chainId = useChainId();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check if connected to Base Mainnet or Base Sepolia
  const isMainnet = isMounted && chainId === base.id;
  const isTestnet = isMounted && chainId === baseSepolia.id;
  
  // Log the current network and contract info being used
  useEffect(() => {
    if (isMounted && chainId) {
      console.log(`Connected to chain ID: ${chainId}`);
      console.log(`Using ${isMainnet ? 'mainnet' : 'testnet'} contract info`);
    }
  }, [chainId, isMainnet, isMounted]);
  
  // If connected to mainnet, use mainnet contract info
  // If connected to testnet or any other network, use testnet contract info
  return {
    abi: isMainnet ? mainnetAbi : testnetAbi,
    contractAddress: isMainnet 
      ? mainnetAddress as `0x${string}` 
      : testnetAddress as `0x${string}`,
  };
} 
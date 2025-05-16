import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  base,
  baseSepolia
} from "wagmi/chains";
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'RockPaperScissors',
  projectId: '2c22698ed6fa65b5ab4a6acb4af0b952',
  chains: [base, baseSepolia],
  ssr: true,
  transports: {
    [base.id]: http(
      'https://mainnet.base.org'
    ),
    [baseSepolia.id]: http(
      'https://sepolia.base.org'
    ),
  },
});

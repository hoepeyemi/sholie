'use client';

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import Layout from "../components/Layout";
import { SelfVerificationProvider } from "../contexts/SelfVerificationContext";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <SelfVerificationProvider>
          <RainbowKitProvider modalSize="wide">
            <Toaster position='top-right' reverseOrder={false} />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </SelfVerificationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

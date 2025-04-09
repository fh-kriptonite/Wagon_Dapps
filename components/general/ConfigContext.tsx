import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createConfig } from '@particle-network/connectkit';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import { evmWalletConnectors } from '@particle-network/connectkit/evm';
import { EntryPosition, wallet } from '@particle-network/connectkit/wallet';
import { aa } from '@particle-network/connectkit/aa';
import { mainnet, sepolia, bsc, bscTestnet } from '@particle-network/connectkit/chains';
import type { Chain } from '@particle-network/connectkit/chains';

// Define the context type
interface ConfigContextType {
  configType: 'evm' | 'social';
  setConfigType: (type: 'evm' | 'social') => void;
  getCurrentConfig: () => any;
}

// Create the context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Environment variables
const projectId = process.env.PARTICLE_NETWORK_PROJECT_ID as string;
const clientKey = process.env.PARTICLE_NETWORK_CLIENT_KEY as string;
const appId = process.env.PARTICLE_NETWORK_APP_ID as string;

if (!projectId || !clientKey || !appId) {
  throw new Error('Please configure the Particle project in .env first!');
}

// Support chains
const supportChains: Chain[] = [];
supportChains.push(mainnet, sepolia, bsc, bscTestnet);

// Create configurations
const evmConfig = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    recommendedWallets: [
      { walletId: 'metaMask', label: 'Recommended' },
      { walletId: 'trustWallet', label: 'Popular' },
      { walletId: 'walletConnect', label: 'Other' },
    ],
    language: 'en-US',
    mode: 'light',
    theme: {
      '--pcm-accent-color': '#ff4d4f',
    },
    logo: 'https://app.wagon.network/logo-title.png',
  },
  walletConnectors: [
    evmWalletConnectors(),
  ],
  plugins: [
    wallet({
      visible: true,
      entryPosition: EntryPosition.BR,
    }),
  ],
  chains: supportChains as unknown as readonly [Chain, ...Chain[]],
});

const socialConfig = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    recommendedWallets: [
      { walletId: 'metaMask', label: 'Recommended' },
      { walletId: 'trustWallet', label: 'Popular' },
      { walletId: 'walletConnect', label: 'Other' },
    ],
    language: 'en-US',
    mode: 'light',
    theme: {
      '--pcm-accent-color': '#ff4d4f',
    },
    logo: 'https://app.wagon.network/logo-title.png',
  },
  walletConnectors: [
    authWalletConnectors({
      authTypes: ['email', 'google', 'apple'],
      fiatCoin: 'USD',
      promptSettingConfig: {
        promptMasterPasswordSettingWhenLogin: 0,
        promptPaymentPasswordSettingWhenSign: 0,
      },
    }),
  ],
  plugins: [
    wallet({
      visible: true,
      entryPosition: EntryPosition.BR,
    }),
    aa({
      name: 'BICONOMY',
      version: '2.0.0',
    }),
  ],
  chains: supportChains as unknown as readonly [Chain, ...Chain[]],
});

// Provider component
export function ConfigProvider({ children }: { children: ReactNode }) {
  const [configType, setConfigType] = useState<'evm' | 'social'>('evm');

  const getCurrentConfig = () => {
    return configType === 'social' ? socialConfig : evmConfig;
  };

  return (
    <ConfigContext.Provider value={{ configType, setConfigType, getCurrentConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

// Custom hook to use the context
export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
} 
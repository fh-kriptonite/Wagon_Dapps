import React from 'react';

import { ConnectKitProvider, createConfig } from '@particle-network/connectkit';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import type { Chain } from '@particle-network/connectkit/chains';
// embedded wallet start
import { wallet } from '@particle-network/connectkit/wallet';
// embedded wallet end
// aa start
// import { aa } from '@particle-network/connectkit/aa';
// aa end
// evm start
import { mainnet, sepolia, bsc, bscTestnet, base, baseSepolia } from '@particle-network/connectkit/chains';
import { evmWalletConnectors } from '@particle-network/connectkit/evm';

const projectId = process.env.PARTICLE_NETWORK_PROJECT_ID as string;
const clientKey = process.env.PARTICLE_NETWORK_CLIENT_KEY as string;
const appId = process.env.PARTICLE_NETWORK_APP_ID as string;

if (!projectId || !clientKey || !appId) {
  throw new Error('Please configure the Particle project in .env first!');
}

const supportChains: Chain[] = [];
if(process.env.PRODUCTION == "true") {
  supportChains.push(mainnet, bsc, base);
} else {
  supportChains.push(mainnet, sepolia, bsc, bscTestnet, base, baseSepolia);
}

const config = createConfig({
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
    logo: 'https://app.wagon.network/logo-title.png',
  },
  walletConnectors: [
    // Add traditional wallet connectors
    evmWalletConnectors(),
    // Social login connector
    authWalletConnectors({
        // Optional, configure this if you're using social logins
        authTypes: ['email', 'google', 'apple'], // Optional, restricts the types of social logins supported
        fiatCoin: 'USD', // Optional, also supports CNY, JPY, HKD, INR, and KRW
        promptSettingConfig: {
            // Optional, changes the frequency in which the user is asked to set a master or payment password
            // 0 = Never ask
            // 1 = Ask once
            // 2 = Ask always, upon every entry
            // 3 = Force the user to set this password
            promptMasterPasswordSettingWhenLogin: 0,
            promptPaymentPasswordSettingWhenSign: 0,
        },
    }),
  ],
  plugins: [
    // embedded wallet start
    wallet({
      visible: false,
      widgetIntegration: 'modal'
    }),
    // AA plugin disabled due to compatibility issues
    // aa({
    //   name: 'BICONOMY',
    //   version: '2.0.0',
    // }),
  ],
  chains: supportChains as unknown as readonly [Chain, ...Chain[]],
});

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <ConnectKitProvider config={config}>
        {children}
      </ConnectKitProvider>
    </div>
  );
};
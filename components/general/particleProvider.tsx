import React from 'react';
import { ConnectKitProvider } from '@particle-network/connectkit';
import { ConfigProvider, useConfig } from './ConfigContext';

// Wrap your application with this component.
export const ParticleConnectkit = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider>
      <ParticleConnectkitInner>{children}</ParticleConnectkitInner>
    </ConfigProvider>
  );
};

// Inner component that uses the config context
const ParticleConnectkitInner = ({ children }: { children: React.ReactNode }) => {
  const { getCurrentConfig } = useConfig();
  const config = getCurrentConfig();

  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};

import React from 'react';
import { ModalProvider } from '@particle-network/connectkit';
import { Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connectors';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PARTICLE_NETWORK_PROJECT_ID: string;
            PARTICLE_NETWORK_CLIENT_KEY: string;
            PARTICLE_NETWORK_APP_ID: string;
            WALLET_PROJECT_ID: string;
        }
    }
}

interface ParticleProviderProps {
    children: React.ReactNode;
}

export function ParticleProvider({ children }: ParticleProviderProps) {
    return (
        <ModalProvider
            options={{
                projectId: process.env.PARTICLE_NETWORK_PROJECT_ID,
                clientKey: process.env.PARTICLE_NETWORK_CLIENT_KEY,
                appId: process.env.PARTICLE_NETWORK_APP_ID,
                chains: [Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet],
                connectors: [
                    ...evmWallets({ projectId: process.env.WALLET_PROJECT_ID, showQrModal: true }),
                ],
                // erc4337:{
                //     name:"BICONOMY",
                //     version:"2.0.0"
                // }
            }}
        >
            {children}
        </ModalProvider>
    );
} 
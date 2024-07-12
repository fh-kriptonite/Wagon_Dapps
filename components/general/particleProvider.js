import { ModalProvider } from '@particle-network/connectkit';
import { Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet } from '@particle-network/chains';
import { evmWallets } from '@particle-network/connectors';

export function ParticleProvider({ children }) {
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
    )
}
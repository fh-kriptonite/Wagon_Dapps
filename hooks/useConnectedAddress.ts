import { useEffect, useState } from 'react';
import { useAccount, useSmartAccount, useWallets } from '@particle-network/connectkit';

export const useConnectedAddress = () => {
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    const {address} = useAccount();
    const smartAccount = useSmartAccount();
    const [primaryWallet] = useWallets();
    
    // Determine if it's a Particle wallet internally
    const isParticleWallet = primaryWallet?.connector?.walletConnectorType === 'particleAuth';

    useEffect(() => {
        const getAddress = async () => {
            console.log('useConnectedAddress effect running:', { isParticleWallet, address });
            
            if(isParticleWallet) {
                try {
                    const smartAddress = await smartAccount?.getAddress();
                    console.log("smartAddress", smartAddress);
                    const finalAddress = smartAddress || address || null;
                    console.log("Setting connectedAddress to:", finalAddress);
                    setConnectedAddress(finalAddress);
                } catch (error) {
                    console.warn('Failed to get smart address, using regular address:', error);
                    console.log("Setting connectedAddress to address:", address);
                    setConnectedAddress(address || null);
                }
            } else {
                console.log("Setting connectedAddress to address:", address);
                setConnectedAddress(address || null);
            }
        }

        getAddress();
    }, [isParticleWallet, address, smartAccount]);

    console.log('useConnectedAddress returning:', { connectedAddress, address, isParticleWallet });

    return {
        connectedAddress: connectedAddress,
        isParticleWallet
    };
}; 
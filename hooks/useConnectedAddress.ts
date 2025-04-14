import { useAccount, useSmartAccount, useWallets } from '@particle-network/connectkit';
import { useParticleAuth } from '@particle-network/connectkit';
import { useState } from 'react';
import { useEffect } from 'react';

export const useConnectedAddress = () => {
    // Retrieve the primary wallet from the Particle Wallets
    const [primaryWallet] = useWallets();
    const smartAccount = useSmartAccount();
    const { isConnected, address } = useAccount();

    // Store userInfo in a useState to use it in your app
    const [userInfo, setUserInfo] = useState<any>(null);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    
    const { getUserInfo } = useParticleAuth();

    useEffect(() => {
        const fetchUserInfo = async () => {
            if(!isConnected) return;
            // Use walletConnectorType as a condition to avoid account not initialized errors
            if (primaryWallet?.connector?.walletConnectorType === 'particleAuth') {
                const userInfo = await getUserInfo();
                
                setUserInfo(userInfo);

                if(!userInfo) {
                    setUserInfo(null);
                    setConnectedAddress(address || null);
                }
            } else {
                setUserInfo(null);
                setConnectedAddress(address || null);
            }
        };
        fetchUserInfo();
    }, [isConnected, getUserInfo]);

    useEffect(() => {
        if(isConnected && userInfo) {
            getSmartAddress();
        }
    }, [isConnected, userInfo]);

    const getSmartAddress = async () => {
        try {
            const smartAddress = await smartAccount?.getAddress();
            setConnectedAddress(smartAddress || null);
        } catch (error) {
            return null;
        }
    };

    return {
        connectedAddress,
        userInfo,
        isSocialLoginActive: userInfo ? true : false
    };
}; 
import { useSmartAccount, useWallets } from '@particle-network/connectkit';
import { SendTransactionMode, AAWrapProvider } from '@particle-network/aa';
import { ethers, Eip1193Provider } from 'ethers';
import { useCallback } from 'react';

export const useGetProvider = () => {
    const [primaryWallet] = useWallets();
    const smartAccount = useSmartAccount();

    const getProvider = useCallback(async () => {
        try {

            var customProvider = null;

            if (primaryWallet?.connector?.walletConnectorType === 'particleAuth') {
            // Init custom provider with gasless transaction mode
                customProvider = smartAccount
                ? new ethers.BrowserProvider(
                    new AAWrapProvider(
                        smartAccount,
                        SendTransactionMode.Gasless
                    ) as Eip1193Provider,
                    "any"
                    )
                : null;
            } else {
                const EOAprovider = await primaryWallet.connector.getProvider();
                customProvider = new ethers.BrowserProvider(EOAprovider as Eip1193Provider, "any");
            }

            // Connect to Ethereum
            if (!customProvider) {
                throw new Error("Provider is not available");
            }

            return customProvider;
        } catch (error) {
            console.error('Failed to get provider:', error);
            throw error;
        }
    }, [primaryWallet]);

    return getProvider;
};